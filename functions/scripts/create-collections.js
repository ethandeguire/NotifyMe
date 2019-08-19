const faunadb = require('faunadb') // Import faunaDB sdk

// configure faunaDB Client with our secret
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

const collections = ["urls", "authentications"]
let errors = []

collections.forEach(collection => {
  client.query(q.CreateCollection({ name: collection }))
    .catch((err) => { if (err.message !== 'instance already exists') errors.push({ name: error.name, message: error.message }) })

  client.query(q.CreateIndex({ name: `all_${collection}`, source: q.Collection(collection) }))
    .catch((err) => { if (err.message !== 'instance already exists') errors.push({ name: error.name, message: error.message }) })

});

if (errors.length != 0) {
  console.log(`Error(s) in create-collection.js: ${errors}`)
  throw new Error(`Error(s) in create-collection.js: ${errors}`)
}

console.log(`collections exist:'${[collections]}'`)