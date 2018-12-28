const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  tel: { type: 'string', required: true},
  avatar: { type: 'string'},
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string'}
})
exports.User.index({ name: 1 }, { unique: true })
exports.User.index({ tel: 1 }, { unique: true }).exec()



const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
//24 位长的 ObjectId 前 4 个字节是精确到秒的时间戳，所以我们没有额外的存创建时间。
//ObjectId 生成规则：前4位时间，然后3位机器，然后两位pid，最后3位计数器
// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

//文章
exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  type: {type: 'string',required: true },
  pv: { type: 'number', default: 0 }
})
exports.Post.index({ author: 1, _id: -1 }).exec()// 按创建时间降序查看用户的文章列表

//留言  ，在提交留言表单时带上了文章 id（postId），通过 hidden 隐藏。
exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  content: { type: 'string', required: true },
  postId: { type: Mongolass.Types.ObjectId, required: true }
})
exports.Comment.index({ postId: 1, _id: 1 }).exec()// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
