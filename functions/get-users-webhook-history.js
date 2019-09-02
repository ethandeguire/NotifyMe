// ------ Definitions ------
//
// POST message input, query parameter as "username":"<USERNAME>"
//
// ------ /Definitions -----

const axios = require('axios');

// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager
const getAllObjectsByUsernameAndCollection = helpers.getAllObjectsByUsernameAndCollection

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  if (event.httpMethod == 'OPTIONS') return callbackPackager(callback, 200, { success: "OPTIONS request" })

  console.log(`--Function 'get-users-webhook-history' invoked`)

  const username = event.queryStringParameters["username"]

  return getAllObjectsByUsernameAndCollection(username, 'webhookhistory')
    .then(objects => callbackPackager(callback, 200, { webhooks: objects }))
    .catch(err => callbackPackager(callback, 400, { error: err }))

}