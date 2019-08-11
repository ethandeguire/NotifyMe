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
const axios = require('axios');

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
            if (body.data.username == obj.data.username) usernameExists = true

            // if username and password are correct
            if (body.data.username == obj.data.username && body.data.password == obj.data.password) {
              return client.query(q.Update(refs[i], { data: { url: body.data.url } }))
                .then((returnVal) => {
                  console.log(`--Updated url of user: ${body.data.username} to ${body.data.url}`)
                  return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(returnVal)
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

            // if password is incorrect
            else if (body.data.username == obj.data.username && body.data.password != obj.data.password){
              console.log(`Bad password for user: ${body.data.username}. Passwords: ${body.data.password}, ${obj.data.password}`)
              return callback(null, {
                statusCode: 400,
                body: `Bad password for user: ${body.data.username}`
              })
            }
          }

          if (!usernameExists){
            console.log(`Username does not exist, creating a new account for ${body.data.username}`)
            // make request here
            return axios.post('/.netlify/functions/add-url-to-db', {
              data: body
            })
            .then((response) => {
              console.log("User sent to add-url-to-db");
              return callback(null, {
                statusCode: 200,
                body: JSON.stringify(`There was no user by ${body.data.username} with the provided password, so one has been created`)
              })
            })
            .catch((error) => {
              console.log("AXIOS REQUEST FAILURE:", error);
              return callback(null, {
                statusCode: 400,
                body: JSON.stringify(`There was no user by ${body.data.username} with the provided password, and we got an error when creating one: ${error}`)
              })
            });
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