// ------ Definitions ------
//
// POST message input, query parameter as "username":"<USERNAME>"
//
// ------ /Definitions -----

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // tell the console:
  console.log(`--Function 'notif' invoked`)

  try {
    console.log(typeof event.queryStringParameters, event.queryStringParameters)
    console.log(typeof event.body, event.body)
  } catch (err) { console.log("1:", err) }

  try {
    let params = JSON.parse(event.queryStringParameters)
    let body = JSON.parse(event.body)
  } catch (err) { console.log("2:", err) }

  try {
    console.log("--params:", params)
    console.log("body:", body)
  } catch (err) { console.log("3:", err) }

  return callback(null, {
    statusCode: 200,
    message: "success"
  })
}