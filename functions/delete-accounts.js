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
  console.log(`--Function 'delete-accounts' invoked`)

  return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_${_COLLECTION_NAME}`))))
    .then((response) => {
      const refs = response.data

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllDataQuery)
        .then((objects) => {
          
          let results = []

          // go through all of the objects in the db to see if they match
          for (let i = 0; i < refs.length; i++) {
            let obj = objects[i]
        
            // figure out if we should delete this one
            let deleteThisOne = false
            accountsToDelete.forEach(account => {
              if (account.username == obj.data.username && account.password == obj.data.password) deleteThisOne = true
            });
            
            // delete if we should delete this one
            if (deleteThisOne){
              results.push(client.query(q.Delete(refs[i]))
                .then((ret) => {
                  console.log(`--Delete user '${obj.data.username}' successful`)
                  return `--Delete user '${obj.data.username}' successful`

                })
                .catch((error) => {
                  console.log(`--error in deleting user '${obj.data.username}', error: ${error}`)
                  return `--error in deleting user '${obj.data.username}', error: ${error}`
                })
              )
            }
          }
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(results)
          })

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