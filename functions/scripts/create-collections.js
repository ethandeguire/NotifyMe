import faunadb from 'faunadb' // Import faunaDB sdk

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

const collections = ["urls", "authentications"]

collections.forEach(collection => {
  client.query(q.CreateCollection({ name: collection }))
    .then((ret) => console.log(ret))
    .catch((err) => console.log(err))
});
