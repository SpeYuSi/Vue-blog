const User = require('../lib/mongo').User

module.exports = {
  // 注册一个用户
  create: function create (user) {
    return User.create(user).exec()
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName (name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec()
  },

  getUserById: function getUserById(id) {
    return User
      .findOne({ _id: id })
      .addCreatedAt()
      .exec()
  },

  updateUserById: function updateUserById(id,data) {
    return User.update({ _id: id }, { $set: data }).exec()
  }
}
