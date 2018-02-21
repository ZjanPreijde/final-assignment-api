// models/user.js
const mongoose = require('../config/database')

// Connect authentication functionality
const passportLocalMongoose = require('passport-local-mongoose')

// Create schema for user
const { Schema } = mongoose
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Insert authentication functionality
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('users', userSchema)
