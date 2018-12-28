module.exports = {
  port: 3000,
  session: {
    secret: 'expblog',
    key: 'expblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/expblog'
}
