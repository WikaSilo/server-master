const { Student } = require('../models')

class StudentController {
  static create(req, res, next) {
    const { firstName, lastName, email } = req.body
    Student.create({ firstName, lastName, email })
      .then(student => res.status(201).json(student))
      .catch(next)
  }
  static readAll(req, res, next) {
    Student.find()
      .then(students => res.status(200).json(students))
      .catch(next)
  }
  static readOne(req, res, next) {
    Student.findById(req.params.id)
      .then(student => {
        if(student) res.status(200).json(student)
        else next({ status: 404, message: 'student not found' })
      })
      .catch(next)
  }
  static update(req, res, next) {
    const { firstName, lastName, email } = req.body
    Student.updateOne({ _id: req.params.id }, { firstName, lastName, email }, { rawResult: true })
      .then(student => res.status(200).json(student))
      .catch(next)
  }
  static delete(req, res, next) {
    Student.findById(req.params.id)
      .then(student => {
        if(student !== null) return Student.findByIdAndDelete(req.params.id)
        else throw ({ status: 404, message: 'student not found' })
      })
      .then(_ => res.status(204).json({ message: 'delete student, success!' }))
      .catch(next)
  }
}

module.exports = StudentController
