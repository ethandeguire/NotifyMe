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

  let params = event.queryStringParameters
  if (!params["username"]) {
    console.log("'username' query parameter must be included in post request")
    return callbackPackager(callback, 400, { error: "'username' query parameter must be included in post request" })
  }

  const username = params["username"]

  return getObjectByUsernameAndCollection(username, 'urls')
    .then(urlObject => {
      const url = urlObject['url']

      // remove host header
      // delete event.headers.host

      // Send a POST request to the found url
      return axios({
        method: 'post',
        url: url,
        headers: event.headers,
      })
        .then((response) => {
          console.log(`--Webhook post message succesfully forwarded to ${url}`);

          // log the event
          createDocument('webhookhistory', {
            data: {
              webhook: event,
              to: url,
              timestamp: Date.now(),
              username: username
            }
          })
            .then(response => {
              return callbackPackager(callback, 200, { success: `${response.statusCode} forwarded from ${event.host} to ${url}, and logged` })
            })
        })
    })
    .catch(err => {
      console.log("**err:", err)
      callbackPackager(callback, 500, { error: err })
    })




}