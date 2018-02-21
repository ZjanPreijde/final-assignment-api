// models/batch.js
const mongoose = require('../config/database')
const { Schema } = mongoose

// const studentSchema = new Schema({
//   name:      { type: String },
//   image_url: { type: String },
// });

const batchSchema = new Schema({
  // students:  [studentSchema],
  startsAt:  { type: Date },
  endsAt:    { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('batches', batchSchema)
