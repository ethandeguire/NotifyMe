// ---- Api methods to call netlify functions ----
const create = (data) => {
  return fetch('/.netlify/functions/create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}
const readAll = () => {
  return fetch('/.netlify/functions/read-all').then((response) => {
    return response.json()
  })
}
const update = (id, data) => {
  return fetch(`/.netlify/functions/update/${id}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}
const deleteid = (id) => {
  return fetch(`/.netlify/functions/delete/${id}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}
const batchDelete = (ids) => {
  return fetch(`/.netlify/functions/delete-batch`, {
    body: JSON.stringify({
      ids: ids
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

// add score
create({username: "testuser", password:"testpass", url:"testing.com"}).then((response) => 
  console.log(response)
)

// read scores
readAll().then((scores) =>
  console.log(scores)
)