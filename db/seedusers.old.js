// ./db/seedusers.js
const request = require('superagent')

const users = require('./fixtures/users.json')

const createUrl = (path) => {
  return `${process.env.HOST || `http://localhost:${process.env.PORT || 3030}`}${path}`
}

const authenticate = (email, password) => {
  request
    .post(createUrl('/sessions'))
    .send({ email, password })
    .then((res) => {
      console.log(email, 'Authenticated!')
    })
    .catch((err) => {
      console.error(email, 'Failed to authenticate!', err.message)
    })
}

for (let user of users) {
  request
    .post(createUrl('/users'))
    .send(user)
    .then((res) => {
      console.log('User ' + user.name + ' created!', 'id:', res.body._id)
      authenticate(user.email, user.password)
    })
    .catch((err) => {
      console.error('Could not create user', err.message)
      // Maybe user already exists
      console.log('Trying to continue...')
      authenticate(user.email, user.password)
    })
}
