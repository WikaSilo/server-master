const jwt = require('jsonwebtoken')

module.exports = {
  sign: function(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
  },
  verify: function(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}
