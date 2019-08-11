// ------ Definitions ------
//
// JSON Input Data:
//  {
//    "ref": "REF"
//    "collection": "COLLECTION"
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
  let data = JSON.parse(event.body)
  return client.query(q.Delete(q.Ref(q.Collection(data["collection"]), data["ref"])))
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