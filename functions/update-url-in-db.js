// ------ Definitions ------
//
// JSON Input Data:
//  {
//    "data":{
//      "{USERNAME}",
//      "{PASSWORD}",
//      "{URL}"
//    }
//  }
//
// ------ /Definitions -----

// import my functions
const helpers = require('./tools/helpers')
const callbackPackager = helpers.callbackPackager
const getObjectByUsernameAndCollection = helpers.getObjectByUsernameAndCollection
const updateDocument = helpers.updateDocument
const createDocument = helpers.createDocument

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  const data = JSON.parse(event.body)["data"]
  const [username, password, url, computer_name] = [data["username"], data["password"], data["url"], data['computer_name']]



  return getObjectByUsernameAndCollection(username, 'urls')
    .then((urlObject) => {

      console.log('*****', username, password, url)

      // if we found a user by that username
      if (urlObject != null) {

        // see if the password is incorrect - return saying so
        if (password != urlObject["password"]) return callbackPackager(callback, 400, { error: "Password is incorrect for this user" })

        // see if the password is correct
        if (password == urlObject["password"]) {

          // update the url in fauna
          return updateDocument(urlObject.ref, { data: { url: url, computer_name: computer_name } })
            .then((returnVal) => {
              console.log(`--Updated url of user: ${username} to ${url}`)
              return callbackPackager(callback, 200, { data: returnVal.data })
            })
        }
      }

      // if we didnt find a user by that username
      else {
        console.log(`--Username does not exist, creating a new account for ${username}`)
        return createDocument('urls', { data: data })
          .then((response) => { return callbackPackager(callback, 200, { data: data }) })
      }

    })
    .catch((error) => {
      console.log("error:", error)
      return callbackPackager(callback, 500, { error: error })
    })
}
