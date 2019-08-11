// ------ Definitions ------
//
// JSON Input Data:
//  {
//    "accounts":[
//      {username: "example", password: "example"}
//    ]
//  }
//
// ------ /Definitions -----

import faunadb from 'faunadb' // Import faunaDB sdk

const _COLLECTION_NAME = "urls"

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  let accountsToDelete = JSON.parse(event.body).accounts

  // tell the console:
  console.log(`--Function 'delete-accounts' invoked, deleting ${accountsToDelete.length}`)

  return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_${_COLLECTION_NAME}`))))
    .then((response) => {
      const refs = response.data

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllDataQuery)
        .then((userAccountObjects) => {
          for (let i = 0; i < refs.length; i++) {
            let userAccountData = userAccountObjects[i].data
            accountsToDelete.forEach(account => {
              if (account.username == userAccountData.username && account.password == userAccountData.password) {
                console.log("match found", userAccountData.username, refs[i])
                return client.query(q.Delete(q.Ref(q.Collection("urls"), refs[i])))
                  .then((returnVal) => {
                    console.log(`--Delete user '${userAccountData.username}' successful`)
                    return callback(null, {
                      statusCode: 200,
                      body: JSON.stringify(returnVal)
                    })
                  })
                  .catch((error) => {
                    console.log(`--error in deleting user '${userAccountData.username}', error: ${error}`)
                    return callback(null, {
                      statusCode: 400,
                      body: JSON.stringify(error)
                    })
                  })
              }
            })
          }
        })
        .catch((error) => {
          console.log('--error', error)
          return callback(null, {
            statusCode: 400,
            body: JSON.stringify(error)
          })
        })
    })
    .catch((error) => {
      console.log('--error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}