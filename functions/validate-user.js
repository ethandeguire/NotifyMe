// ------ Definitions ------
//
// JSON Input Data:
//  {
//    data: {
//      username: "{username}",
//      password: "{password}"
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
import Axios from 'axios';

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  let body = JSON.parse(event.body)

  // tell the console:
  console.log(`--Function 'validate-user' invoked`)

  // return callback(null, {
  //   statusCode: 200,
  //   headers : {"Access-Control-Allow-Origin": "*"},
  //   body: JSON.stringify({testing: "testing"})
  // })


  return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_urls`))))
    .then((response) => {
      const refs = response.data

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })



      // then query the refs
      return client.query(getAllDataQuery)
        .then((objects) => {
          for (let i = 0; i < refs.length; i++) {
            let obj = objects[i]

            // if username and password are correct
            if (body.data.username == obj.data.username && body.data.password == obj.data.password) {
              // create new session token in database, send back to client
              return Axios({
                method: 'POST',
                url: 'https://notifyme.netlify.com/.netlify/functions/add-authentication',
                data: { data: { username: body.data.username } }
              })
                .then((response) => {
                  console.log(`validated user '${body.data.username}' with token '${response.data.data.session_token}'`)
                  return callback(null, {
                    statusCode: 200,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(response.data) // this contains the session_key
                  })
                })
                .catch((error) => {
                  console.log("error:", error)
                  return callback('error', {
                    statusCode: 400,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(error)
                  })
                })
            }

            // if password is incorrect
            else if (body.data.username == obj.data.username && body.data.password != obj.data.password) {
              console.log(`Bad password for user: ${body.data.username}. Passwords: ${body.data.password}, ${obj.data.password}`)
              callback(null, {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: `Bad password for user: ${body.data.username}`
              })
            }
          }
        })
        .catch((error) => {
          console.log('--error', error)
          return callback(null, {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            message: JSON.stringify(error)
          })
        })
    })
    .catch((error) => {
      console.log('--error', error)
      return callback(null, {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        message: JSON.stringify(error)
      })
    })
}