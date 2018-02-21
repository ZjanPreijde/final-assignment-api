// routes/batches.js
const router = require('express').Router()
const passport = require('../config/auth')
const authenticate = passport.authorize('jwt', { session: false })

const { Batch, Student } = require('../models')

const checkBatch = require('../lib/checkBatch')

module.exports = io => {
  router
    .get('/batches', (req, res, next) => {
      Batch.find()
        // Newest batches first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((batches) => res.json(batches))
        // Throw a default 500 error if something goes wrong
        .catch((error) => next(error))
    })
    // TODO?: Also return students?
    .get('/batches/:batchId', (req, res, next) => {
      const batchId = req.params.batchId
      Batch.findById(batchId)
        .then((batch) => {
          if (!batch) { return next() }
          const students = {}
          res.json(batch, students)
        })
        .catch((error) => next(error))
    })
    .post('/batches', authenticate, (req, res, next) => {
      // Validation in checkBatch
      const newBatch = checkBatch(batch, req.body)

      Batch.create(newBatch)
        .then((batch) => {
          io.emit('action', {
            type: 'BATCH_CREATED',
            payload: batch
          })
          res.json(batch)
        })
        .catch((error) => next(error))
    })
    // TODO?: No Update in specs !
    // If I do it, check dates and evaluation dates
    // Maybe only allow for batches without students/evaluations
    .patch('/batches/:batchId', authenticate, (req, res, next) => {
      const batchId = req.params.batchId

      Batch.findById(batchId)
        .then((batch) => {
          if (!batch) { return next() }

          // Validation in checkBatch
          const updatedBatch = checkBatch(batch, req.body)

          Batch.findByIdAndUpdate(batchId, { $set: updatedBatch }, { new: true })
            .then((batch) => {
              io.emit('action', {
                type: 'BATCH_UPDATED',
                payload: batch
              })
              res.json(batch)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    // TODO?: NO Delete in specs !
    // If I do it, also remove students and evaluations.
    // Maybe only allow for batches without students
    .delete('/batches/:batchId', authenticate, (req, res, next) => {
      const batchId = req.params.batchId
      Batch.findByIdAndRemove(batchId)
        .then(() => {
          io.emit('action', {
            type: 'BATCH_REMOVED',
            payload: batchId
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: batchId
          })
        })
        .catch((error) => next(error))
    })

  return router
}
