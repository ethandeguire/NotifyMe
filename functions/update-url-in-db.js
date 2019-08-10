// ------ Definitions ------
//
// JSON Input Data:
//  {
//    "data":{
//      "{USERNAME}",
//      "{PASSWORD}",
//      "{URL}"
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

  let body = JSON.parse(event.body)

  // tell the console:
  console.log(`--Function 'update-${_COLLECTION_NAME}-in-db' invoked`)

  return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_${_COLLECTION_NAME}`))))
    .then((response) => {
      const refs = response.data
      // console.log(`--${_COLLECTION_NAME}:`, refs)
      console.log(`--${refs.length} ${_COLLECTION_NAME} found`)

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllDataQuery)
        .then((objects) => {
          console.log("--Got all objects, looping through to find matching")

          for (let i = 0; i < refs.length; i++) {
            let obj = objects[i]
            console.log("--usernames, pws: ", body.data.username, obj.data.username, body.data.password, obj.data.password)
            if (body.data.username == obj.data.username && body.data.password == obj.data.password) {
              console.log("--update object: \n", obj)
              console.log("--object reference:", refs[i])

              return client.query(q.Update(refs[i], { data: { url: body.data.url } }))
                .then((returnVal) => {
                  console.log("--Update return statement: " + returnVal)
                  return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(returnVal)
                  })
                })
                .catch((error) => console.log("--Error in Update: " + error))
            }
          }
        })
        .catch((error) => {
          console.log('--error', error)
          return callback(null, {
            statusCode: 400,
            body: JSON.stringify(error)
          })
        })
    })
    .catch((error) => {
      console.log('--error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}