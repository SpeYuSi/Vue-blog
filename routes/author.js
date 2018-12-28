
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

const PostModel = require('../models/posts')
const CommentModel = require('../models/comments')
// get  posts/user._id

router.get('/:author', function (req, res, next) {
  const author = req.params.author
  var file = {}
  var types = {}
  PostModel.getPosts(author)
    .then(function (posts) {
      //遍历统计归档和分类
      posts.map(function (post) {
        var date = post.created_at.slice(0,7)
        if(file[date])
        {
          file[date]++
        }else
        {
          file[date]=1
        }
        if(types[post.type])
        {
          types[post.type]++
        }else{
          types[post.type] = 1
        }

      })
      res.render('posts', {
        posts: posts,
        file: file,
        types: types,
        author:author
      })
    })
    .catch(next)
})

// GET /posts特定时间的文章页
//   eg: GET /author/:author/date?date=xxx   使用url中的date区分主页和用户页
router.get('/:author/date', function (req, res, next) {
  const DATE = req.query.date
  const author = req.params.author
  var Posts = []
  PostModel.getPosts(author)
    .then(function (posts) {
      //遍历获取对应月份的文章
      posts.map(function (post) {
        let datetime = post.created_at.slice(0,7)
        if(datetime==DATE){
          Posts.push(post)
        }
      })
      res.render('spposts', {
        posts: Posts,

      })
    })
    .catch(next)
})

// GET /posts特定分类的文章页
//   eg: GET /posts/type?type=xxx
router.get('/:author/type', function (req, res, next) {
  const type = req.query.type
  const author = req.params.author
  var Posts = []
  PostModel.getPosts(author)
    .then(function (posts) {
      //遍历获取的文章统计相同月份文章数
      posts.map(function (post) {

        if(type==post.type){
          Posts.push(post)
        }
      })

       res.render('spposts', {
        posts: Posts,
      })
    })
    .catch(next)
})


module.exports = router
