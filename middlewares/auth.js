const { verify } = require('../helpers/jwt')
const { User } = require('../models')

module.exports = {
  authentication: function(req, res, next) {
    try {
      const decode = verify(req.headers.token)
      
      // check user for better validation jwt
      User.findOne({ email: decode.email })
        .then(user => {
          if(user) {
            req.decode = decode
            next()
          } else {
            next({ status: 403, message: 'user not found, authentication failed' })
          }
        })
        .catch(next)
    } catch(err) {
      next({ status: 403, message: err })
    }
  }
}