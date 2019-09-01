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


const _headers = { 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*' }

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  console.log('0-0-0-0-0-0-0-0-0-0-0-0')
  // console.log(event, context)

  if (event.httpMethod == 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers: _headers,
      body: JSON.stringify("OPTIONS REQUEST RETURN")
    })
  }

  let reqUsername, reqPassword
  try {
    reqUsername = event.headers.username
    reqPassword = event.headers.password
  } catch (err) {
    console.log('-err', err)
    return callback(null, {
      statusCode: 400,
      headers: _headers,
      body: JSON.stringify(err)
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
                    headers: _headers,
                    body: JSON.stringify(response.data) // this contains the session_key
                  })
                })
                .catch((error) => {
                  console.log("error:", error)
                  return callbackError(callback, 500, error)
                })
            }

            // if password is incorrect
            else if (reqUsername == obj.data.username && reqPassword != obj.data.password) {
              console.log(`Bad password for user: ${reqUsername}. Passwords: ${reqPassword}, ${obj.data.password}`)
              return callbackError(callback, 400, {error: "Password is incorrect for this user"})
            }
          }

          // then username does not exist:
          return callbackError(callback, 400, {error: "Username does not exist"}) // bad request

        })
        .catch((error) => { // internal server error
          console.log('--error', error)
          return callbackError(callback, 500, error)
        })
    })
    .catch((error) => { // internal server error
      console.log('--error', error)
      return callbackError(callback, 500, error)
    })
}


function callbackError(callback, statCode, errObj) {
  return callback(null, {
    statusCode: statCode,
    headers: _headers,
    body: JSON.stringify(errObj)
  })
}
