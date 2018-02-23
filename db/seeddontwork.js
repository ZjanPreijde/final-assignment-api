// ./db/seedrest.js
const request = require('superagent')
const createUrl = (path) => {
  return `${process.env.HOST || `http://localhost:${process.env.PORT || 3030}`}${path}`
}

const { Batch } = require('../models')
const batches = require('./fixtures/batches.json')

let email    = 'arien@codaisseur.com'
let password = '123abc'
let token

// SHIT, does not work, returns "Internal Server Error"
// My fault or what? Pfffff :-(
const createRest = (token) => {
  for (let batch in batches) {
    request
      .post(createUrl('/batches'))
      .set('Authorization', `Bearer ${token}`)
      .send(batch)
      .then((res) => {
        console.log('Batch seeded ...', res.body.name)
      })
      .catch((err) => {
        console.error('Error seeding batch!', err.message)
      })
  }
}

console.log('Start sign-in request ...')
request
  .post(createUrl('/sessions'))
  .send({ email, password})
  .then((res) => {
    console.log(email, 'authenticated')
    return createRest(res.body.token)
  })
  .catch((err) => {
    console.error('Failed to authenticate!', err.message)
  })

return
