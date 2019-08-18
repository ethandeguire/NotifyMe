// ------ Definitions ------
//
// JSON Input Data:
//  {
//    data: {
//      username: "{username}"
//    }
//  } 
//
//
// JSON Return Data:
//  {
//    data: {
//      session_token: "TOKEN"
//    }
//  }
//
// ------ /Definitions -----

import faunadb from 'faunadb' // Import faunaDB sdk
const axios = require('axios');
const crypto = require('crypto')

const _COLLECTION_NAME = "authentications"

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

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllDataQuery)
        .then((objects) => {

          let usernameExists = false

          for (let i = 0; i < refs.length; i++) {
            let obj = objects[i]

            // If this, then username exists, not new user
            if (body.data.username == obj.data.username) {
              usernameExists = true

              // update key
              let session_token = newSessionToken()
              return client.query(q.Update(refs[i], {
                data: {
                  username: body.data.username,
                  session_token: session_token
                }
              }))
                .then((returnVal) => {
                  console.log(`--Refreshed session_token of user: ${body.data.username} to ${session_token}`)
                  return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({data: session_token})
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
          }

          if (!usernameExists) {
            console.log(`Username does not exist, creating a new token for ${body.data.username}`)
            // create a document in collection authentications with data from the event
            let session_token = newSessionToken()
            return client.query(q.Create(
              q.Collection(_COLLECTION_NAME), //returns the ref of the collection
              {
                data: {
                  username: body.data.username,
                  session_token: session_token
                }
              }
            ))
              .then((response) => {
                console.log("success: " + JSON.stringify(response))
                return callback(null, {
                  statusCode: 200,
                  body: JSON.stringify({data: session_token})
                })
              })
              .catch((error) => {
                console.log("error: " + JSON.stringify(error))
                return callback("error", {
                  statusCode: 400,
                  body: JSON.stringify(error)
                })
              })
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

let newSessionToken = () => {
  return crypto.randomBytes(20).toString('hex')
}