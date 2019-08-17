// ------ Definitions ------
//
// JSON Input Data:
//  {
//    data: {
//      username: "{username}",
//      password: "{password}",
//      url: "url",
//    }
//  }
//
// ------ /Definitions -----

import faunadb from 'faunadb' // Import faunaDB sdk

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // parse the string body into a useable JS object 
  const body = JSON.parse(event.body)
  console.log("--event:", event)

  // tell the console:
  console.log('Function `add-url-to-db` invoked')

  // create a document in collection urls with data from the event
  return client.query(q.Create(
    q.Collection('urls'), //returns the ref of the collection
    body
  ))
    .then((response) => {
      console.log("[---] add-url-to-db: success: " + JSON.stringify(response))
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response)
      })
    })
    .catch((error) => {
      console.log("[ERR] add-url-to-db" + JSON.stringify(error))
      return callback("error", {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}