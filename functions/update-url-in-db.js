// ------ Definitions ------
//
// JSON Input Data:
//  {
//    [
//      "{USERNAME}",
//      "{PASSWORD}"
//    ]
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

  // tell the console:
  console.log('Function `add-url-to-db` invoked')

  // create a document in collection urls with data from the event
  return client.query(q.Paginate(q.Match(q.Index("all_urls"), "newtest")))
  .then((result) => {console.log("--SUCCESS:" + JSON.stringify(result))})
  .catch((error) => {console.log("--ERROR:" + JSON.stringify(error))})
}