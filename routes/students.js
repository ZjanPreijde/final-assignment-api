// routes/students.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Student, Batch } = require('../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadBatch = (req, res, next) => {
  const batchId = req.params.id

  Batch.findById( batchId )
    .then( (batch) => {
      req.batch = batch
      next()
    })
    .catch((error) => next(error))
}

const getStudents = (req, res, next) => {
  const batchId = req.params.id
  Student.find( { batchId: batchId } )
    .then( (students) => {
      req.students = students
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    // Return students in this batch
    .get('/batch/:id/students', loadBatch, getStudents, (req, res, next) => {
      if (!req.batch || !req.students) { return next() }
      res.json(req.students)
    })

    // Add student to batch
    .post('/batches/:id/students', authenticate, loadBatch, (req, res, next) => {
      if (!req.batch) { return next() }

      // req.account._id  =  logged in user, comes from passport/authentication
      const batchId   = req.params.id

      if (req
          .batch
          .students
          .filter((student) => student._id.toString() === studentId.toString()).length > 0) {
        const error = Error.new('Student is already in this batch!')
        error.status = 401
        return next(error)
      }

      // Add the user to the students
      // TODO: How to get the student with correct batchId in Student
      req.batch.students = [...req.batch.students, { studentId }]

      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch new student data
    getStudents,
    // Respond with new student data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.students
        }
      })
      res.json(req.students)
    })

    .delete('/batches/:id/students'
        , authenticate
        , loadBatch, getStudents
        , (req, res, next) => {
      if (!req.batch) { return next() }

      // TODO: for each student, delete evaluations, delete student.

      const studentIds = req.account._id
        .batch
        .students
        .filter((student) => student.studentId.toString() === studentId.toString())[0]

      if (!currentStudent) {
        const error = Error.new('This student is not in this batch!')
        error.status = 401
        return next(error)
      }

      req.batch.students = req.batch.students
        .filter((student) => p.studentId.toString() !== studentId.toString())
      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new student data
    getStudents,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          game: req.batch,
          players: req.students
        }
      })
      res.json(req.students)
    })

  return router
}
