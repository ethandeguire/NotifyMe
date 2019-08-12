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

  let clientserverurl = geturlbyusername /* write this */

  // Send a POST request
  return axios({
    method: 'post',
    url: clientserverurl,
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
      console.log(`error: ${response}`);
      return callback(null, {
        statusCode: 400,
        message: `error: ${response}`
      })
    })


}