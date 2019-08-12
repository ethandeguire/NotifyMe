// ------ Definitions ------
//
// JSON Return Data:
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

const _COLLECTION_NAME = "urls"

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // tell the console:
  console.log(`--Function 'get-all-${_COLLECTION_NAME}' invoked`)

  let username = event.queryStringParameters["username"]

  return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_${_COLLECTION_NAME}`))))
    .then((response) => {
      const refs = response.data
      console.log(`--${_COLLECTION_NAME}:`, refs)
      console.log(`--${refs.length} ${_COLLECTION_NAME} found`)

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllDataQuery).then((urlObjects) => {
        urlObjects.forEach(urlObject => {
          if (username == urlObject.data.username){
            return callback(null, {
              statusCode: 200,
              body: JSON.stringify(urlObject.data.url)
            })
          }
        });
      })
    }).catch((error) => {
      console.log('--error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}