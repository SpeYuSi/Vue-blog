const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkLogin = require('../middlewares/check').checkLogin


// GET /mod 修改页
router.get('/', function (req, res, next) {
  UserModel.getUserById(req.session.user._id)
    .then(user=>{
        res.render('changeinfo',{user:user})
    }).catch(next)


})

// POST /mod  提交修改
router.post('/', function (req, res, next) {
  const gender = req.fields.gender
  const bio = req.fields.bio
  var avatar = req.files.avatar.path.split(path.sep).pop()

  //头像是否上传
  if(!avatar.match('\\.')){
    avatar = 'default.jpg'
  }



  UserModel.updateUserById(req.session.user._id, { gender: gender, bio: bio, avatar: avatar })
        .then(function () {
          req.flash('success', '修改信息成功')
          // 编辑成功后跳转到上一页
          res.redirect('/posts')
        })
        .catch(next)
  })

module.exports = router
