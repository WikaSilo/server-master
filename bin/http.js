const http = require('http')
const app = require('../app')

const server = http.createServer(app)
const PORT = process.env.PORT || 3000

server.listen(PORT, function() {
  console.log('this app running on port: ', PORT)
})
