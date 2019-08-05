import faunadb from 'faunadb'

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = (event, context, callback) => {
  console.log('Function `read-all` invoked')
  return client.query(q.Paginate(q.Match(q.Ref('indexes/all_urls'))))
    .then((response) => {
      const refs = response.data
      console.log('refs', refs)
      console.log(`${refs.length} urls found`)
      // create new query out of refs. http://bit.ly/2LG3MLg
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllDataQuery).then((ret) => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(ret)
        })
      })
    }).catch((error) => {
      console.log('error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}
