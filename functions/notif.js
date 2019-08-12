// ------ Definitions ------
//
// POST message input, query parameter as "username":"<USERNAME>"
//
// ------ /Definitions -----



// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // tell the console:
  console.log(`--Function 'notif' invoked`)

  let body = JSON.parse(event.body)
  let params = JSON.parse(event.queryStringParameters)

  console.log("--params:", params)
  console.log("body:", body)
  
  return callback(null, {
    statusCode: 200,
    message: "success"
  })
}