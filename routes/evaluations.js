// ./routes/evaluations.js
const router = require('express').Router()
const passport = require('../config/auth')
const { User, Student, Batch, Evaluation } = require('../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadBatch = (req, res, next) => {
  const batchId = req.params.batchId
  Batch.findById( batchId )
    .then( (batch) => {
      req.batch = batch
      next()
    })
    .catch((error) => next(error))
}

const loadStudent = (req, res, next) => {
  const studentId = req.params.studentId

  Student.findById( studentId )
    .then( (student) => {
      req.batch = student
      next()
    })
    .catch((error) => next(error))
}

const getEvaluations = (req, res, next) => {
  const batchId = req.params.batchId
  const studentId = req.params.studentId
  Evaluation
    .find( { $and: [ { batchId: batchId }, { studentId: studentId }] } )
    .then( (evaluations) => {
      req.evaluations = evaluations
      next()
    })
    .catch((error) => next(error))
}

const getEvaluationCount = (req, res, next) => {
  const batchId = req.params.batchId
  const studentId = req.params.studentId
  Evaluation
    .find( { $and: [ { batchId: batchId }, { studentId: studentId }] } ).count
    .then( (evaluations) => {
      req.evaluations = evaluations
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    // Return evaluations for this batch
    .get('/batch/:batchId/evaluations'
        , loadBatch, getEvaluations, (req, res, next) => {
      if (!req.batch || !req.evaluations) { return next() }
      res.json(req.evaluations)
    })
    // Return evaluations for this student in this batch
    .get('/batch/:batchId/students/:studentId/evaluations'
        , loadBatch, loadStudent, getEvaluations, (req, res, next) => {
      if (!req.batch || !req.student || !req.evaluations) { return next() }
      res.json(req.evaluations)
    })
    // Add evaluation to student
    .post('/batches/:batchId/students/:studentId/evaluations'
        , authenticate, loadBatch, loadStudent, (req, res, next) => {
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
