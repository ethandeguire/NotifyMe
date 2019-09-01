
// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager
const getObjectByUsernameAndCollection = helpers.getObjectByUsernameAndCollection
const addAuthenticationByUsername = helpers.addAuthenticationByUsername
const createDocument = helpers.createDocument


// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  console.log(`--Function 'validate-user' invoked`)

  if (event.httpMethod == 'OPTIONS') return callbackPackager(callback, 200, { success: "OPTIONS request" })

  let reqUsername, reqPassword
  try {
    reqUsername = event.headers.username
    reqPassword = event.headers.password
  } catch (err) {
    console.log('-err', err)
    return callbackPackager(callback, 400, { error: 'username and password headers must be included in the request' + JSON.stringify(err) })
  }

  if (reqPassword.length == 0 || reqUsername.length == 0) return callbackPackager(callback, 400, { error: 'Include both a username and a password' })

  return getObjectByUsernameAndCollection(reqUsername, 'urls')
    .then((urlObject) => {

      // check if we found a user
      if (urlObject != null) return callbackPackager(callback, 400, { error: "A user is already using this email" })

      // create a new user:
      return createDocument('urls', { data: { username: reqUsername, password: reqPassword } })
        .then((result) => {

          // authenticate the new user
          return addAuthenticationByUsername(reqUsername)
            .then((result) => {

              // return the new user's session_token
              return callbackPackager(callback, 200, { data: { session_token: result } })
            })
        })

    })
    .catch((err) => {
      console.log("error:", err)
      return callbackPackager(callback, 500, { error: err })
    })
}
