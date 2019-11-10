const { User } = require('../models')
const { compareHash } = require('../helpers/bcryptjs')
const { sign } = require('../helpers/jwt')

class UserController {
  static signUp(req, res, next) {
    const { name, email, password } = req.body
    User.create({ name, email, password })
      .then(user => {
        const payload = {
          name: user.name,
          email: user.email
        }
        const token = sign(payload)
        res.status(201).json({
          message: 'success sign up',
          token: token
        })
      })
      .catch(next)
  }
  static signIn(req, res, next) {
    const { email, password } = req.body
    if(!email || !password) res.status(400).json({ message: 'bad request' })
    else {
      const invalidSigninError = {
        status: 404,
        message: 'invalid email/password'
      }
  
      User.findOne({ email })
        .then(user => {
          if(user) {
            if(compareHash(password, user.password)) {
              const payload = {
                name: user.name,
                email: user.email
              }
              const token = sign(payload)
              res.status(200).json({
                message: 'success sign in',
                token: token
              })
  
            } else next(invalidSigninError)
          } else next(invalidSigninError)
        })
        .catch(next)
    }
  }
}

module.exports = UserController
