// ------ Definitions ------
//
// POST message input, query parameter as "username":"<USERNAME>"
//
// ------ /Definitions -----

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

  return callback(null, {
    statusCode: 200,
    message: "success"
  })
}