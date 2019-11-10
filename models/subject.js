const { Schema, model } = require('mongoose')

const subjectSchema = new Schema({
  name: String
}, {
  timestamps: true
})

const Subject = model('Subject', subjectSchema)

module.exports = Subject
