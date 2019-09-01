// ------ Definitions ------
//
// JSON Input Data:
//  {
//    data: {
//      username: "{username}",
//      password: "{password}",
//      url: "url",
//    }
//  }
//
// ------ /Definitions -----

const helpers = require('./tools/helpers')
const createDocument = helpers.createDocument
const callbackPackager = helpers.callbackPackager

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  // parse the string body into a useable JS object 
  const body = JSON.parse(event.body)

  // tell the console:
  console.log('Function `add-url-to-db` invoked')

  // create a document in collection urls with data from the event
  return createDocument('urls', body)
    .then((response) => {
      console.log("[---] add-url-to-db: success: " + JSON.stringify(response))
      return callbackPackager(callback, 200, {data: "success"})
    })
    .catch((error) => {
      console.log("[ERR] add-url-to-db" + JSON.stringify(error))
      return callbackPackager(callback, 400, {error: error})
    })
}