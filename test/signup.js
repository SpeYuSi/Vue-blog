const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../index')
const User = require('../lib/mongo').User

const existName = 'existName'
const testName = 'testName'
const existTel = '17780603116'
const testTel = '17780603117'
const errorTel = 'qwasddqw1223'
describe('signup', function () {
  describe('POST /signup', function () {
    const agent = request.agent(app)// persist cookie when redirect
    beforeEach(function (done) {
      // 创建一个用户
      User.create({
        name: existName,
        password: '123456',
        tel: existTel,
        avatar: '',
        gender: 'x',
        bio: ''
      })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })

    afterEach(function (done) {
      // 删除测试用户
      User.deleteMany({ name: { $in: [existName, testName] } })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })

    after(function (done) {
      process.exit()
    })

    // 用户名错误的情况
    it('wrong name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: '12345678908' })
        .attach('avatar', path.join(__dirname, 'test.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/名字请限制在 1-10 个字符/))
          done()
        })
    })
    // 密码错误的情况
    it('wrong password', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName, gender: 'm', bio: 'noder', tel:testTel, password: '12', repassword: '123456' })
        .attach('avatar', path.join(__dirname, 'test.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/密码至少 6 个字符/))
          done()
        })
    })
    // 电话错误的情况
    it('wrong tel', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName, gender: 'm', bio: 'noder', tel:errorTel, password: '123456'})
        .attach('avatar', path.join(__dirname, 'test.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请输入有效的手机号码/))
          done()
        })
    })



    // 用户名被占用的情况
    it('duplicate name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: existName, gender: 'm', bio: 'noder', tel:testTel, password: '123456'})
        .attach('avatar', path.join(__dirname, 'test.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用户名已被占用/))
          done()
        })
    })
        // 电话被占用的情况
     it('duplicate tel', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName, gender: 'm', bio: 'noder', tel:existTel, password: '123456'})
        .attach('avatar', path.join(__dirname, 'test.png'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/手机号已被注册/))
          done()
        })
    })

    // 注册成功的情况
    it('success', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName, gender: 'm', bio: 'noder', tel: testTel, password: '123456'})
        .attach('avatar', path.join(__dirname, 'test.png'))
        .redirects()
        .end(function (err, res) {

          if (err) return done(err)
          assert(res.text.match(/注册成功/))
          done()
        })
    })
})

})




