const { Schema, model } = require('mongoose')
const { hashPassword } = require('../helpers/bcryptjs')

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name required']
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalid format'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: [6, 'Password min 6 char']
  }
}, {
  timestamps: true
})

// validation
userSchema.path('email').validate(function(value) {
  return User.findOne({ email: value })
    .then(user => {
      if(user) return false
    })
}, 'Email user is already registered!')

// hashPassword
userSchema.pre('save', function(next) {
  // kalo udah ke save
  this.password = hashPassword(this.password)
  next()
})

const User = model('User', userSchema)

module.exports = User
