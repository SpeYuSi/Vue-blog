const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../index')
const Post = require('../lib/mongo').Post

const title = 'title'
const type = 'type'
const content = 'contentsadasasd'

describe('/posts/create', function () {
  describe('POST /posts/create', function () {
    const agent = request.agent(app)// persist cookie when redirect
    after(function(){
      agent
        .post('/signin')
          .type('form')
          .field({ name:'qwe',password:'111111' })

    })


    afterEach(function (done) {
      // 删除测试用户
      Post.deleteMany({ title: title })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })
    // 标题为空的情况
    it('null title', function (done) {
      agent
        .post('/posts/create')
        .type('form')
        .field({ title:'',type:type,content:content })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请填写标题/))
          done()
        })
    })
    // 分类为空的情况
    it('null type', function (done) {
      agent
        .post('/posts/create')
        .type('form')
        .field({ title:title,type:'',content:content })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请填写分类/))
          done()
        })
    })
     // 内容为空的情况
    it('null content', function (done) {
      agent
        .post('/posts/create')
        .type('form')
        .field({ title:title,type:type,content:'' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请填写内容/))
          done()
        })
    })
    // 成功的情况
    it('success', function (done) {
      agent
        .post('/posts/create')
        .type('form')
        .field({ title:title,type:type,content:content })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/成功/))
          done()
        })
    })

})

})




