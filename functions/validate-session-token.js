// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager
const getObjectByUsernameAndCollection = helpers.getObjectByUsernameAndCollection

// local variables, could be an env var or something idk
const AUTHENTICATION_EXPIRATION_TIME_MINS = 120

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  // check if this is a preflight request, if it is, return 200
  if (event.httpMethod == 'OPTIONS') return callbackPackager(callback, 200, { success: "OPTIONS request" })

  const data = JSON.parse(event.body)['data']
  const [username, session_token] = [data["username"], data["session_token"]]

  // tell the console:
  console.log(`--Function 'validate-user' invoked`)

  getObjectByUsernameAndCollection(username, 'authentications')
    .then((urlObject) => {

      if (urlObject == null) return callbackPackager(callback, 400, { error: "This user is not authenticated" })

      // find the difference in minutes between now and token creation
      let difMins = Math.round((Date.now() - (urlObject['timestamp'] / 1000)) / 1000 / 60 * 100) / 100

      // if the token is correct and not older than the expiry period, return valid
      if (urlObject['session_token'] == session_token && difMins < AUTHENTICATION_EXPIRATION_TIME_MINS) {
        return callbackPackager(callback, 200, { data: { is_valid: true, mins_left: AUTHENTICATION_EXPIRATION_TIME_MINS - difMins } })
      }

      // if its not valid, return that
      else return callbackPackager(callback, 200, { data: { is_valid: false } })

    })
    .catch(err => callbackPackager(callback, 500, { error: err }))
}