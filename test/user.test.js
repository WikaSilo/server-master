const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { User } = require('../models')

chai.use(chaiHttp)
const expect = chai.expect

// create initial data
let newUser = {
  name: 'jiraya',
  email: 'jiraya@gamil.com',
  password: 'kodokadalahpalindrome'
}
let userSignin = {
  email: newUser.email,
  password: newUser.password
}

// middleware testing
before(function() {
  const data = {
    name: 'kakashi',
    email: 'kakashi@gmail.com',
    password: 'cidori'
  }
  User.create(data)
    .then(user => console.log('testing: success create initial user'))
    .catch(console.log)
})
// delete data after testing
after(function(done) {
  if(process.env.NODE_ENV === 'testing') {
    User.deleteMany({})
      .then(_ => {
        console.log('testing: delete data user success!')
        done()
      })
      .catch(console.log)
  }
})

describe('User Routes', function() {
  describe('POST /users/signup', function() {
    describe('success process', function() {
      it('should send an object (message, token) with 201 status code', function(done) {
        chai.request(app)
        .post('/users/signup')
        .send(newUser)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'token')
          expect(res.body.message).to.equal('success sign up')
          done()
        })
      })
    })
    describe('errors process', function() {
      it('should send an error with 400 status code because missing name value', function(done) {
        const withoutName = { ...newUser }
        delete withoutName.name
        chai.request(app)
        .post('/users/signup')
        .send(withoutName)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Name required')
          done()
        })
      })
      it('should send an error with 400 status code because missing email value', function(done) {
        const withoutEmail = { ...newUser }
        delete withoutEmail.email
        chai.request(app)
        .post('/users/signup')
        .send(withoutEmail)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email required')
          done()
        })
      })
      it('should send an error with 400 status code because missing password value', function(done) {
        const withoutPassword = { ...newUser }
        delete withoutPassword.password
        chai.request(app)
        .post('/users/signup')
        .send(withoutPassword)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Password required')
          done()
        })
      })
      it('should send an error with 400 status code because format email invalid', function(done) {
        const falseEmailFormat = { ...newUser, email: 'salahformat.com' }
        chai.request(app)
        .post('/users/signup')
        .send(falseEmailFormat)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email invalid format')
          done()
        })
      })
      it('should send an error with 400 status code because min char', function(done) {
        const falsePasswordFormat = { ...newUser, password: 'kuy' }
        chai.request(app)
        .post('/users/signup')
        .send(falsePasswordFormat)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Password min 6 char')
          done()
        })
      })
      it('should send an error with 400 status code because duplicate data', function(done) {
        chai.request(app)
        .post('/users/signup')
        .send(newUser)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'errors')
          expect(res.body.message).to.equal('validation error')
          expect(res.body.errors).to.be.an('array').that.includes('Email user is already registered!')
          done()
        })
      })
    })
  })
  describe('POST /users/signin', function() {
    describe('success process', function() {
      it('should send an object (message, token) with 200 status code', function(done) {
        chai.request(app)
        .post('/users/signin')
        .send(userSignin)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object').to.have.any.keys('message', 'token')
          expect(res.body.message).to.equal('success sign in')
          done()
        })
      })
    })
    describe('errors process', function() {
      it('should send an error with 400 status code because missing email value', function(done) {
        const withoutEmail = { ...userSignin }
        delete withoutEmail.email
        chai.request(app)
        .post('/users/signin')
        .send(withoutEmail)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('bad request')
          done()
        })
      })
      it('should send an error with 400 status code because missing password value', function(done) {
        const withoutPassword = { ...userSignin }
        delete withoutPassword.password
        chai.request(app)
        .post('/users/signin')
        .send(withoutPassword)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('bad request')
          done()
        })
      })
      it('should send an error with 404 status code because invalid email', function(done) {
        const falseEmail = { ...userSignin }
        falseEmail.email = 'kosasih@gmail.com'
        chai.request(app)
        .post('/users/signin')
        .send(falseEmail)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid email/password')
          done()
        })
      })
      it('should send an error with 404 status code because invalid password', function(done) {
        const falsePassword = { ...userSignin }
        falsePassword.password = 'passwordKosasih'
        chai.request(app)
        .post('/users/signin')
        .send(falsePassword)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object').to.have.any.keys('message')
          expect(res.body.message).to.equal('invalid email/password')
          done()
        })
      })
    })
  })
})