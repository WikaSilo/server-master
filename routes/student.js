const express = require('express')
const StudentController = require('../controllers/student')

const router = express.Router()

router.get('/', StudentController.readAll)
router.get('/:id', StudentController.readOne)
router.post('/', StudentController.create)
router.put('/:id', StudentController.update)
router.delete('/:id', StudentController.delete)

module.exports = router
