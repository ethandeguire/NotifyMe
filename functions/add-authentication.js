// import my functions
const h = require('./tools/helpers')

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  let username = JSON.parse(event.body).data.username

  // tell the console:
  console.log(`--Function 'update-authentications-in-db' invoked`)

  return h.addAuthenticationByUsername(username)
    .then((result) => {
      return h.callbackPackager(callback, 200, { data: { session_token: result } })
    })
    .catch((err) => {
      console.log("error:", err)
      return h.callbackPackager(callback, 500, { error: err })
    })
}