const express = require('express')
const userRoutes = require('./user')
const studentRoutes = require('./student')
const subjectRoutes = require('./subject')
const { authentication } = require('../middlewares/auth')

const router = express.Router()

router.get('/', function(req, res, next) {
  res.status(200).json({
    message: 'welcome to liveServer, please check api documentation'
  })
})

router.use('/users', userRoutes)

router.use(authentication)
router.use('/students', studentRoutes)
router.use('/subjects', subjectRoutes)

module.exports = router
