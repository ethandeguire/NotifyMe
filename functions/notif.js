// ------ Definitions ------
//
// POST message input, query parameter as "username":"<USERNAME>"
//
// ------ /Definitions -----

const axios = require('axios');

// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager
const getObjectByUsernameAndCollection = helpers.getObjectByUsernameAndCollection
const createDocument = helpers.createDocument


// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // tell the console:
  console.log(`--Function 'notif' invoked`)

  if (event.httpMethod == 'OPTIONS') return callbackPackager(callback, 200, { success: "OPTIONS request" })

  let params = event.queryStringParameters
  if (!params["username"]) {
    console.log("'username' query parameter must be included in post request")
    return callbackPackager(callback, 400, { error: "'username' query parameter must be included in post request" })
  }
  const username = params["username"]

  return getObjectByUsernameAndCollection(username, 'urls')
    .then(urlObject => {
      const url = urlObject['url']

      // remove host header - this is to prevent some cors garbage from disallowing the request
      delete event.headers.host

      // Send a POST request to the found url
      return axios({
        method: 'post',
        url: url,
        headers: event.headers,
      })
        .then((response) => {

          console.log(`--Webhook post message succesfully forwarded to ${url}`);

          // log the event
          return createDocument('webhookhistory', {
            data: {
              webhook: event,
              to: url,
              timestamp: Date.now(),
              username: username
            }
          })
            .then(response => {
              console.log(`--Webhook post message succesfully logged in 'webhookhistory'`);
              return callbackPackager(callback, 200, { success: `forwarded webhook from ${event.host} to ${url}, and logged` })
            })
            .catch(err => {
              console.log(`--Error in logging the request:`, err)
              return callbackPackager(callback, 500, { error: err })
            })
        })
    })
    .catch(err => {
      console.log("**err:", err)
      return callbackPackager(callback, 500, { error: err })
    })




}