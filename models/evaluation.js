// models/evaluation.js
const mongoose = require('../config/database')

const { Schema } = mongoose

// userId is creator (logged in user),
//   evaluation can only be edited by creator
const evaluationSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'users' },
  batchId:   { type: Schema.Types.ObjectId, ref: 'batches' },
  studentId: { type: Schema.Types.ObjectId, ref: 'students' },
  scoreDate: { type: Date}
  score:     { type: Number, enum: [ 'red', 'yellow', 'green' ] },
  remarks:   { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('evaluations', evaluationSchema)
