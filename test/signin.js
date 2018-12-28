const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../index')
const User = require('../lib/mongo').User


describe('signin', function () {
  describe('POST /signin', function () {
    const agent = request.agent(app)// persist cookie when redirect

    beforeEach(function (done) {
      // 创建一个用户
      User.create({
        name: 'test2',
        password: '111111',
        tel: '17780601122',
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
      User.deleteMany({ name: 'test2' })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })


    // 用户名错误的情况
    it('wrong name', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: 'qweqweqweqweqe',password: '121212'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/名字请限制在 1-10 个字符/))
          done()
        })
    })
    // 密码空的情况
    it('wrong password', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: 'test',password:'123' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/密码至少 6 个字符/))
          done()
        })
    })
    //用户不存在
    it('Error User', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: 'test1',password:'111111' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用户不存在/))
          done()
        })
    })
     //密码错误
    it('Error password', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: 'test2',password:'222222' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用户名或密码错误/))
          done()
        })
    })
     //成功
    it('success', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: 'test2',password:'111111' })
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/登录成功/))
          done()
        })
    })

})
})
