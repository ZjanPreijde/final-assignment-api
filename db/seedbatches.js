// ./db/seedbatches.js

const { Batch }   = require('../models')
const batches     = require('./fixtures/batches.json')

// Batches
let newName, newStartsAt, newEndsAt
for (let batch of batches) {
  newName     = batch.name
  newStartsAt = new Date(batch.startsAt)
  newEndsAt   = new Date(batch.endsAt)
  console.log(newName, newStartsAt, newEndsAt)
  Batch.create( { name: newName, startsAt: newStartsAt, endsAt: newEndsAt }
    , function (err, newBatch) {
      if (err) {
        console.error(err.message)
      } else {
        console.log('Batch seeded', newBatch.name)
      }
    }
  )
}

return true
