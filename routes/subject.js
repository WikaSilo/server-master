const express = require('express')
const SubjectController = require('../controllers/subject')

const router = express.Router()

router.get('/', SubjectController.readAll)
router.post('/', SubjectController.create)
router.delete('/:id', SubjectController.delete)

module.exports = router
