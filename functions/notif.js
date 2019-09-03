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
          console.log(response.data.data.client_info)

          console.log(`--Webhook post message succesfully forwarded to ${url}`);

          // log the event
          return createDocument('webhookhistory', {
            data: {
              webhook: event,
              to: url,
              timestamp: Date.now(),
              username: username,
              computer_name: response['data']['data']['client_info']['computer_name'],
              computer_os: response['data']['data']['client_info']['os'],
              success: true
            }
          })
            .then(response => {
              console.log(`--Webhook post message succesfully logged in 'webhookhistory'`);
              return callbackPackager(callback, 200, { message: `forwarded webhook from ${event.host} to ${url}, and logged` })
            })
            .catch(err => {
              console.log(`--Error in logging the request:`, err)
              return callbackPackager(callback, 500, { message: 'Internal server error in logging the error', error: err })
            })
        })
        .catch((err) => {
          // if we could not reach the client
          if (err.message === "Request failed with status code 404") {
            console.log('--Error in forwading request, 404. Logging event and telling the provider that all is ok.')

            // log the event
            return createDocument('webhookhistory', {
              data: {
                webhook: event,
                to: url,
                timestamp: Date.now(),
                username: username,
                success: false
              }
            })
              .then(result => { callbackPackager(callback, 200, { message: "Contact made with NotifyMe servers, but NotifyMe servers could not contact the notifier on the client's machine. Make sure the notifier is set up correctly. This event has been logged." }) })
              .catch(error => { callbackPackager(callback, 200, { message: "Contact made with NotifyMe servers, but NotifyMe servers could not contact the notifier on the client's machine. Make sure the notifier is set up correctly. NotifyMe has also failed to log this event.", error: error }) })
          }

          // else there was another error when reaching the client, likely in the setup of their notifier:
          callbackPackager(callback, 400, { error: err })
        })
    })
    .catch(err => {
      console.log('***err', err)
      if (err.status == '404') {
        return callbackPackager(callback, 200, {})
      }

      // console.log("**err that is not a 404:", err)
      // return callbackPackager(callback, 500, { error: err })
    })
}

function log_event() {

}