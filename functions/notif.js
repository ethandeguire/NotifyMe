// ------ Definitions ------
//
// POST message input, query parameter as "username":"<USERNAME>"
//
// ------ /Definitions -----

const axios = require('axios');

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // tell the console:
  console.log(`--Function 'notif' invoked`)

  let params = event.queryStringParameters
  if (!params["username"]) {
    console.log("'username' query parameter must be included in post request")
    return callback(null, { statusCode: 400, message: "'username' query parameter must be included in post request" })
  }

  let username = params["username"]

  console.log("--username: ", username)
  console.log("--event: ", event)

  let usernameJson = JSON.stringify({ username: username })
  console.log("++", usernameJson)

  return axios({
    method: 'get',
    url: `https://notifyme.netlify.com/.netlify/functions/get-url-by-username?username=${username}`,
  })
    .then((response) => {
      let data = response.data
      console.log("--", data)
      let url = data
      console.log("url, response: ", url, response)

      // Send a POST request
      return axios({
        method: 'post',
        url: response,
        headers: event.headers
      })
        .then((response) => {
          console.log(`success: ${response}`);
          return callback(null, {
            statusCode: 200,
            message: `success: ${response}`
          })
        })
        .catch((response) => {
          console.log(`error in forwarding request: ${response}`);
          return callback(null, {
            statusCode: 400,
            message: `error in forwarding request: ${response}`
          })
        })
    })
    .catch((response) => {
      console.log(response)
      console.log(`error in getting username: ${response}`);
      return callback(null, {
        statusCode: 400,
        message: `error in getting username: ${response}`
      })
    })




}