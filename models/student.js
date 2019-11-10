const { Schema, model } = require('mongoose')

const studentSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name required']
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalid format'],
    unique: true,
  }
}, {
  timestamps: true
})

// validation
studentSchema.path('email').validate(function(value) {
  return Student.findOne({ email: value })
    .then(student => {
      if(student) return false
    })
}, 'Email student is already registered!')

const Student = model('Student', studentSchema)

module.exports = Student
