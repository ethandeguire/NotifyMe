import faunadb from 'faunadb' // Import faunaDB sdk

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

// export our lambda function as named "handler" export
exports.handler = (event, context, callback) => {

  let body = JSON.parse(event.body)

  // tell the console:
  console.log(`--Function 'validate-user' invoked`)

  return client.query(q.Paginate(q.Match(q.Ref(`indexes/all_authentications`))))
    .then((response) => {
      const refs = response.data

      // create new query out of refs
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })

      // then query the refs
      return client.query(getAllDataQuery)
        .then((objects) => {

          for (let i = 0; i < refs.length; i++) {
            let obj = objects[i]

            // find object of this username
            if (body.data.username == obj.data.username) {
              if (body.data.session_token == obj.data.session_token) {
                return callback(null, {
                  statusCode: 200,
                  body: {
                    data: {
                      is_valid: true,
                      name: obj.data.name,
                      email: obj.data.email,
                      url: obj.data.url
                    }
                  }
                })
              } else {
                return callback("error", {
                  statusCode: 200,
                  body: {
                    data: {
                      is_valid: false
                    }
                  }
                })
              }
            }
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