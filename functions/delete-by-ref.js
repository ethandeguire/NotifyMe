// ------ Definitions ------
//
// JSON Input Data:
//  {
//    "ref":{
//      {}
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
  let ref = JSON.parse(event.body).ref
  return client.query(q.Delete(ref))
    .then((response) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response)
      })
    })
    .catch((response) => {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(response)
      })
    })
}