// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager

import faunadb from 'faunadb' // Import faunaDB sdk

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  if (event.httpMethod == 'OPTIONS') return callbackPackager(callback, 200, { success: "OPTIONS request" })

  let params = event.queryStringParameters
  if (!params["type"]) {
    console.log("'type' query parameter must be included in post request")
    return callbackPackager(callback, 400, { error: "'type' query parameter must be included in post request" })
  }

  let _COLLECTION_NAME = params["type"]

  // tell the console:
  console.log(`--Function 'get-all-${_COLLECTION_NAME}' invoked`)

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
      return client.query(getAllDataQuery).then((ret) => {
        return callbackPackager(callback, 200, ret)
      })
    }).catch((error) => {
      console.log('--error', error)
      return callbackPackager(callback, 400, error)
    })
}