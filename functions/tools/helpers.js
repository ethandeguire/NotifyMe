// dependencies:
const faunadb = require('faunadb') // Import faunaDB sdk
const crypto = require('crypto')

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({ secret: 'fnADVEKXmjACASmqtZzNdLcl3JpIVGzc7Yxzfsk9' })




// ----------------- helper functions -----------------

// sends a callback with a status code and the required headers
const callbackPackager = (callback, statCode, retobj) => {
  return callback(null, {
    statusCode: statCode,
    headers: { 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': '*' },
    body: JSON.stringify(retobj)
  })
}

// returns the entire collection of the input collection name
const getAllObjectsInCollection = (collection) => {
  console.log('--getAllObjectsInCollection invoked')
  return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_${collection}`))))
    .then((response) => {
      const refs = response.data

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllDataQuery)
        .then((objects) => {

          // add the ref onto each of the data objects
          for (let i = 0; i < refs.length; i++) {
            objects[i]['data']['ref'] = refs[i]
            objects[i]['data']['timestamp'] = objects[i]['ts']
          }
          // return the objects

          return objects
        })
    })
}

// searches FaunaDB collection for a user with the input username, returns the document
const getObjectByUsernameAndCollection = (searchUsername, collection) => {
  console.log('--getObjectByUsernameAndCollection invoked')
  return getAllObjectsInCollection(collection)
    .then((objects) => {

      for (let i = 0; i < objects.length; i++) {

        // return the object if the username matches
        if (searchUsername == objects[i].data.username) {
          return objects[i].data
        }
      }

      return null
    })
}

const getAllObjectsByUsernameAndCollection = (searchUsername, collection) => {
  return getAllObjectsInCollection(collection)
    .then(objects => {
      // create a list of objects
      let returnObjects = []

      // add any objects with the same username to the return list
      for (let i = 0; i < objects.length; i++) {
        if (objects[i]['data']['username'] == searchUsername) returnObjects.push(objects[i])
      }

      // return the list
      return returnObjects
    })
}

// creates or updates, then returns the session token for the specified user
const addAuthenticationByUsername = (usernameToAuthenticate) => {
  return getObjectByUsernameAndCollection(usernameToAuthenticate, 'authentications')
    .then((urlObject) => {
      if (urlObject == null) {
        // user does not already have a session token

        console.log(`Username does not exist, creating a new token for '${usernameToAuthenticate}'`)

        let session_token = newSessionToken()

        // create a document in collection authentications with data from the event
        return createDocument('authentications', {
          data: {
            username: usernameToAuthenticate,
            session_token: session_token
          }
        })
          .then((response) => {
            return session_token
          })

      } else {

        // user already has a session token, create them a new session token
        let session_token = newSessionToken()
        return updateDocument(urlObject.ref, {
          data: {
            username: usernameToAuthenticate,
            session_token: session_token
          }
        })
          .then((response) => {
            return session_token
          })
      }
    })
}

const createDocument = (collection, document) => {
  return client.query(q.Create(q.Collection(collection), document))
}

const updateDocument = (ref, document) => {
  return client.query(q.Update(ref, document))
}

// takes in a collection name and ref id and deletes that document
const deleteDocument = (collection, ref) => {
  return client.query(q.Delete(q.Ref(q.Collection(collection), ref)))
}




// ----------------- export the functions -----------------
exports.callbackPackager = callbackPackager
exports.getAllDBObjectsInCollection = getAllObjectsInCollection
exports.getObjectByUsernameAndCollection = getObjectByUsernameAndCollection
exports.getAllObjectsByUsernameAndCollection = getAllObjectsByUsernameAndCollection
exports.addAuthenticationByUsername = addAuthenticationByUsername
exports.createDocument = createDocument
exports.updateDocument = updateDocument
exports.deleteDocument = deleteDocument




// ----------------- helper functions for the helper functions -----------------
const newSessionToken = () => {
  return crypto.randomBytes(20).toString('hex')
}