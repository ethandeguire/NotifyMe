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
  secret: 'fnADVEKXmjACASmqtZzNdLcl3JpIVGzc7Yxzfsk9'
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  let reqUsername, reqPassword
  try {
    reqUsername = event.headers.username
    reqPassword = event.headers.password
  } catch (err){
    console.log('-err', err)
    return callback(null, {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*', "Access-Control-Allow-Credentials" : true},
      message: JSON.stringify(err)
    })
  }

  // tell the console:
  console.log(`--Function 'validate-user' invoked`)

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
            if (reqUsername == obj.data.username && reqPassword == obj.data.password) {
              // create new session token in database, send back to client
              return Axios({
                method: 'POST',
                url: 'https://notifyme.netlify.com/.netlify/functions/add-authentication',
                data: { data: { username: reqUsername } }
              })
                .then((response) => {
                  console.log(`validated user '${reqUsername}' with token '${response.data.data.session_token}'`)
                  return callback(null, {
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*', "Access-Control-Allow-Credentials" : true},
                    body: JSON.stringify(response.data) // this contains the session_key
                  })
                })
                .catch((error) => {
                  console.log("error:", error)
                  return callback('error', {
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*', "Access-Control-Allow-Credentials" : true},
                    body: JSON.stringify(error)
                  })
                })
            }

            // if password is incorrect
            else if (reqUsername == obj.data.username && reqPassword != obj.data.password) {
              console.log(`Bad password for user: ${reqUsername}. Passwords: ${reqPassword}, ${obj.data.password}`)
              return callback(null, {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*', "Access-Control-Allow-Credentials" : true},
                body: `Bad password for user: ${reqUsername}`
              })
            } ``
          }
        })
        .catch((error) => {
          console.log('--error', error)
          return callback(null, {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*', "Access-Control-Allow-Credentials" : true},
            message: JSON.stringify(error)
          })
        })
    })
    .catch((error) => {
      console.log('--error', error)
      return callback(null, {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*', "Access-Control-Allow-Credentials" : true},
        message: JSON.stringify(error)
      })
    })
}