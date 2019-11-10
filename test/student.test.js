const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { Student, User } = require('../models')
const { sign } = require('../helpers/jwt')

chai.use(chaiHttp)
const expect = chai.expect

// create initial data
let newStudent = {
  firstName: 'sasuke',
  lastName: 'uchiha',
  email: 'sasuke@gmail.com'
}
let initialStudent = {}
let initialToken = ''
let falseId = '5d63b24530a316a809302c57'
let invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// middleware testing
before(function(done) {
  // generateToken
  User.create({
    name: 'sakura',
    email: 'sakura@gmail.com',
    password: 'sarada'
  })
    .then(user => {
      initialToken = sign({
        _id: user._id,
        name: user.name,
        email: user.email
      })
      console.log('success generate token')
      return Student.create({
        firstName: 'naruto',
        lastName: 'uzumaki',
        email: 'naruto@gmail.com'
      })
    })
    .then(student => {
      initialStudent = student
      done()
    })
    .catch(console.log)
})
// delete data after testing
after(function(done) {
  if(process.env.NODE_ENV === 'testing') {
    Student.deleteMany({})
      .then(_ => {
        console.log('testing: delete data student success!')
        return User.deleteMany({})
      })
      .then(_ => {
        console.log('testing: delete data user success!')
        done()
      })
      .catch(console.log)
  }
})

describe('Student CRUD', function() {
  describe('POST /students', function() {
    describe('success process', function() {
      it('should send an object (_id, firstName, lastName, email) with 201 status code', function(done) {
        chai.request(app)
        .post('/students')
        .send(newStudent)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object').to.have.any.keys('_id', 'firstName', 'lastName', 'email')
          expect(res.body).to.includes({ firstName: newStudent.firstName, lastName: newStudent.lastName, email: newStudent.email})
          done()
        })
      })
    })
    describe('errors process', function() {
      it('should send an error with 400 status code because missing first name value', function(done) {
        const withoutFirstname = { ...newStudent }
        delete withoutFirstname.firstName
        chai.request(app)
        .post('/students')
        .send(withoutFirstname)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('First name required')
          done()
        })
      })
      it('should send an error with 400 status code because missing last name value', function(done) {
        const withoutLastname = { ...newStudent }
        delete withoutLastname.lastName
        chai.request(app)
        .post('/students')
        .send(withoutLastname)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Last name required')
          done()
        })
      })
      it('should send an error with 400 status code because missing email value', function(done) {
        const withoutEmail = { ...newStudent }
        delete withoutEmail.email
        chai.request(app)
        .post('/students')
        .send(withoutEmail)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email required')
          done()
        })
      })
      it('should send an error with 400 status code because format email invalid', function(done) {
        const falseEmailFormat = { ...newStudent, email: 'salahformat.com' }
        chai.request(app)
        .post('/students')
        .send(falseEmailFormat)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email invalid format')
          done()
        })
      })
      it('should send an error with 400 status code because duplicate data', function(done) {
        chai.request(app)
        .post('/students')
        .send(newStudent)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email student is already registered!')
          done()
        })
      })
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .post('/students')
        .send(newStudent)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .post('/students')
        .send(newStudent)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
  })
  describe('GET /students', function() {
    describe('success process', function() {
      it('should send an array of object with 200 status code', function(done) {
        chai.request(app)
        .get('/students')
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done()
        })
      })
    })
    describe('error process', function() {
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .get('/students')
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .get('/students')
        .send(newStudent)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
  })
  describe('GET /students/:id', function() {
    describe('errors process', function() {
      it('should send an object with message student not found and 404 status code because _id', function(done) {
        chai.request(app)
        .get('/students/' + falseId)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('student not found')
          done()
        })
      })
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .get('/students/' + falseId)
        .send(newStudent)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .get('/students/' + falseId)
        .send(newStudent)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
    describe('success process', function() {
      it('should send correct data with 200 status code', function(done) {
        chai.request(app)
        .get('/students/' + initialStudent._id)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object').to.have.any.keys('_id', 'firstName', 'lastName', 'email')
          expect(res.body).to.includes({ _id: String(initialStudent._id), firstName: initialStudent.firstName, lastName: initialStudent.lastName, email: initialStudent.email})
          done()
        })
      })
    })
  })
  describe('DELETE /students/:id', function() {
    describe('errors process', function() {
      it('should send an object with message student not found and 404 status code because _id', function(done) {
        chai.request(app)
        .delete('/students/' + falseId)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('student not found')
          done()
        })
      })
      it('should send an error with 403 status code because token undefined', function(done) {
        chai.request(app)
        .delete('/students/' + initialStudent._id)
        .send(newStudent)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('jwt must be provided')
          done()
        })
      })
      it('should send an error with 403 status code because invalid token', function(done) {
        chai.request(app)
        .delete('/students/' + initialStudent._id)
        .send(newStudent)
        .set('token', invalidToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid signature')
          done()
        })
      })
    })
    describe('success process', function() {
      it('should send 204 status code', function(done) {
        chai.request(app)
        .delete('/students/' + initialStudent._id)
        .set('token', initialToken)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(204)
          done()
        })
      })
    })
  })
})