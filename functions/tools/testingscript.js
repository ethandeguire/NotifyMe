// dependencies:
const faunadb = require('faunadb') // Import faunaDB sdk

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({ secret: 'fnADVEKXmjACASmqtZzNdLcl3JpIVGzc7Yxzfsk9' })

// import my functions
const helpers = require('./helpers')
const deleteDocument = helpers.deleteDocument
const getAllObjectsInCollection = helpers.getAllObjectsInCollection

// This code deletes every document in the specified collection
/*
const collection = 'CHANGE_THIS_TO_COLLECTION_NAME'
getAllObjectsInCollection(collection)
  .then(objects => {
    objects.forEach(object => {
      const ref = object.ref.id
      deleteDocument(collection, ref)
    });
  })
*/

const collection = 'authentications'
getAllObjectsInCollection(collection)
  .then(objects => {
    objects.forEach(object => {
      const ref = object.ref.id
      console.log('\n\nref:',ref)
    });
  })