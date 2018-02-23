// ./db/seeduser2.js
const jwt = require('jsonwebtoken')
const passport = require('../config/auth')
const jwtOptions = require('../config/jwt')

const { User } = require('../models')
const users = require('./fixtures/users.json')

for (let user of users) {
  console.log('Seed loop', user.name)
  let newName     = user.name
  let newEmail    = user.email
  let newPassword = user.password
  User.register(new User({ name: newName, email: newEmail }),
    newPassword,
    function (err, newUser) {
      if (err) {
        console.log('User ', newName, newEmail, newPassword, 'could NOT be authenticated')
        console.log(err)
      } else {
        console.log('User ', newName, newEmail, newPassword, 'authenticated')
      }
    }
  )

  // let newUser = new User(user)
  // newUser.save(function (err) {
  //   if (err) {
  //     console.log('Error creating user', user.name)
  //   } else {
  //     console.log('User', user.name, 'created')
  //     User.register(
  //         new User({ email: newEmail }),
  //         newPassword,
  //         function(err, user) {
  //           if (err) {
  //             console.log('User ', newName, newEmail, newPassword, 'could NOT be authenticated')
  //             console.log(err)
  //           } else {
  //             console.log('User ', newName, newEmail, newPassword, 'authenticated')
  //           }
  //         }
  //     )
  //   }
  // })
}
return
