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

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // tell the console:
  console.log('Function `get-all-urls` invoked')

  return client.query(q.Paginate(q.Match(q.Ref('indexes/all_urls'))))
    .then((response) => {
      const urlRefs = response.data
      console.log('urls:', urlRefs)
      console.log(`${urlRefs.length} urls found`)

      // create new query out of urls refs
      const getAllUrlsDataQuery = urlRefs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllUrlsDataQuery).then((ret) => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(ret)
        })
      })
    }).catch((error) => {
      console.log('error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}