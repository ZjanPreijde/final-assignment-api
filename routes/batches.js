// routes/batches.js
const router = require('express').Router()
const passport = require('../config/auth')
const authenticate = passport.authorize('jwt', { session: false })

const { Batch, Student } = require('../models')

const checkBatch = require('../lib/checkBatch')

module.exports = io => {
  router
    .get('/batches', authenticate, (req, res, next) => {
      Batch.find()
        .sort({ createdAt: -1 })
        .then((batches) => res.json(batches))
        .catch((error) => next(error))
    })
    .post('/batches', authenticate, (req, res, next) => {
      // Validation in checkBatch
      // let batch = { req.body.name, req.body.startsAt, req.body.startsAt }
      // const newBatch = checkBatch({}, req.body)
      const newBatch = { name: req.body.name,
        startsAt: new Date(req.body.startsAt),
        newEndsAt: new Date(req.body.endsAt) }
      console.log(newBatch)

      Batch.create(newBatch)
        .then((batch) => {
          io.emit('action', {
            type: 'BATCH_CREATED',
            payload: batch
          })
          res.json(batch)
        })
        .catch((error) => next(error))
    }) // End .post
    // TODO?: Also return students?
    .get('/batches/:id', (req, res, next) => {
      const batchId = req.params.id
      Batch.findById(batchId)
        .then((batch) => {
          if (!batch) { return next() }
          // const students = {}
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
