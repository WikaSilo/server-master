const { Subject } = require('../models')

class SubjectController {
  static create(req, res, next) {
    const { name } = req.body
    Subject.create({ name })
      .then(subject => res.status(201).json(subject))
      .catch(next)
  }
  static readAll(req, res, next) {
    Subject.find()
      .then(subjects => res.status(200).json(subjects))
      .catch(next)
  }
  static delete(req, res, next) {
    Subject.deleteOne({ _id: req.params.id })
      .then(_ => res.status(204).json({ message: 'delete subject, success!' }))
      .catch(next)
  }
}

module.exports = SubjectController
