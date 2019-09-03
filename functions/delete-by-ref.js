// ------ Definitions ------
//
// JSON Input Data:
//  {
//    "ref": "REF"
//    "collection": "COLLECTION"
//  }
//
// ------ /Definitions -----

// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager
const deleteDocument = helpers.deleteDocument

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  const [collection, ref] = [data['collection'], data['ref']]

  return deleteDocument(collection, ref)
    .then(res => callbackPackager(callback, 200, res))
    .catch(err => callbackPackager(callback, 400, err))
}