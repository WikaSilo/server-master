const mongoose = require('mongoose')
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/liveServer'

const mongoConfig = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: true
}

mongoose.connect(`${mongoUri}-${process.env.NODE_ENV}`, mongoConfig, function(err) {
  if(err) console.log('failed connect database')
  else console.log('success connect database')
})
