// ./db/seedstudents.js

const { Batch }   = require('../models')
const { Student } = require('../models')
const students    = require('./fixtures/students.json')

// Students
let batchId, newName, newImageUrl
for (let student of students) {
  Batch.findOne({ 'name': student.batch }
    , function(err, batch) {
      if (err) {
        console.error(err.message)
      } else {
        batchId     = batch._id
        newName     = student.name
        newImageUrl = student.imageUrl
        console.log(batchId.toString(), newName, newImageUrl)
        Student.create( { batchId: batchId, name: newName, imageUrl: newImageUrl}
          , function (err, newStudent) {
            if (err) {
              console.error(err.message)
            } else {
              console.log('Student seeded', newStudent.name)
            }
          }
        )
      }
    }
  )
}
return true
