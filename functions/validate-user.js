
// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager
const getObjectByUsernameAndCollection = helpers.getObjectByUsernameAndCollection
const addAuthenticationByUsername = helpers.addAuthenticationByUsername

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

  return getObjectByUsernameAndCollection(reqUsername, 'urls')
    .then((urlObject) => {

      // check if we found a user
      if (urlObject == null) return callbackPackager(callback, 400, { error: "Username does not exist" })

      // check if the password matches
      if (reqPassword != urlObject.password) return callbackPackager(callback, 400, { error: "Password is incorrect for this user" })

      // create new session token in database, send back to client
      return addAuthenticationByUsername(reqUsername)
        .then((result) => {
          return callbackPackager(callback, 200, {data: {session_token: result}})
        })
    })
    .catch((err) => {
      console.log("error:", err)
      return callbackPackager(callback, 500, { error: err })
    })
}
