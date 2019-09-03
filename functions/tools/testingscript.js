// dependencies:
const faunadb = require('faunadb') // Import faunaDB sdk

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({ secret: 'fnADVEKXmjACASmqtZzNdLcl3JpIVGzc7Yxzfsk9' })

// import my functions
const helpers = require('./helpers')
const deleteDocument = helpers.deleteDocument
const getAllObjectsInCollection = helpers.getAllObjectsInCollection

/* This code deletes every document in the specified collection */
// const collection = 'CHANGE_THIS_TO_COLLECTION_NAME'
// getAllObjectsInCollection(collection)
//   .then(objects => {
//     objects.forEach(object => {
//       deleteDocument(collection, object.ref.id)
//     })
//   })

/* This code deletes every document in all of the specified collections */
// const collections = ['authentications', 'urls', 'webhookhistory']
// collections.forEach(collection => {
//   getAllObjectsInCollection(collection)
//     .then(objects => {
//       objects.forEach(object => {
//         deleteDocument(collection, object.ref.id)
//       })
//     })
// })
