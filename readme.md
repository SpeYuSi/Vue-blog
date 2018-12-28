### blog

## 初始化一个express项目

1.  npm init     生成package.json
2.  npm i express@4.14.0 --save    安装express
3.  npm i -g supervisor   安装supervisor 监听当前目录下改动并自动重启程序。

eq.query:  ?name=haha，req.query 的值为 {name: 'haha'}
req.params:  /:name，访问 /haha，req.params 的值为 {name: 'haha'}
req.body: 解析后请求体需使用 body-parser，请求体为 {"name": "haha"}，则 req.body 为 {name: 'haha'}

一个简单的express服务器
//index.js
  const express = require('express')
  const app = express()

  app.get('/', function (req, res) {
    res.send('hello, express')
  })

  app.listen(3000)

## 使用路由
 1.
  app.get('/', function (req, res) {
    res.send('hello, express')
  })
 2.使用express.Router模块
  每个路由文件生成一个 express.Router 实例 router 并导出,使用app.use 挂载到不同的路径。
    //index.js
  const indexRouter = require('./routes/index')
  app.use('/', indexRouter)
  const router = express.Router()
  //routes/index.js
  router.get('/', function (req, res) {
    res.send('hello, express')
  })

  module.exports = router

## 模板引擎ejs
  
  安装ejs   npm i ejs --save
  
  app.set('views', path.join(__dirname, 'views'))// 设置存放模板文件的目录
    app.set('view engine', 'ejs')// 设置模板引擎为 ejs
  
  创建模板
  **views/users.ejs**
  <!DOCTYPE html>
  <html>
    <head>
      <style type="text/css">
        body {padding: 50px;font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;}
      </style>
    </head>
    <body>
      <h1><%= name.toUpperCase() %></h1>
      <p>hello, <%= name %></p>
    </body>
  </html>
  
  ejs 的 3 种常用标签：
  1.<% code %>：运行 JavaScript 代码，不输出
  2.<%= code %>：显示转义后的 HTML内容
  3.<%- code %>：显示原始 HTML 内容
  
  在使用ejs模板时，将模板拆成可以复用的片段使用 <%- include('header') %>来复用
  
  渲染模板
  调用 res.render 函数渲染 ejs 模板，res.render 第一个参数是模板的名字，这里是 users 则会匹配 views/users.ejs，第二个参数是传给模板的数据

## express的中间件（middleware）
    1.使用中间件
  
  app.use(function (req, res, next) {
    console.log('1')
    next()
  })

  通过 app.use 加载中间件，在中间件中通过 next 将请求传递到下一个中间件，next 可接受一个参数接收错误信息，如果使用了 next(error)，则会返回错误而不会传递到下一个中间件
  
  2.错误处理中间件
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
  注意点：中间件的加载顺序很重要
  express 有成百上千的第三方中间件，在开发过程中我们首先应该去 npm上寻找是否有类似实现的中间件，尽量避免造轮子，节省开发时间。下面给出几个常用的搜索 npm 模块的网站：
  1.http://npmjs.com(npm 官网)
  2.http://node-modules.com
  3.https://npms.io
  4.https://nodejsmodules.org
  
## blog环境

  Node.js:8.9.1
  MongoDB:3.4.10
  Express:4.16.2

## 准备工作

  1.创建目录结构
  2.安装依赖模块
  
  config-lite     读取配置文件
  connect-flash   页面通知的中间件，基于 session 实现
  connect-mongo   将 session 存储于 mongodb，结合 express-session 使用
  ejs       模板
  express     web 框架
  express-formidable  接收表单及文件上传的中间件
  express-session   session 中间件
  marked    markdown 解析
  moment    时间格式化
  mongolass   mongodb 驱动
  objectid-to-timestamp   根据 ObjectId 生成时间戳
  sha1    sha1 加密，用于密码加密
  winston@2.0.0     日志
  express-winston@2.0.0      express 的 winston 日志中间件
  
  3.ESLint
  使用 ESLint 可以规范代码书写，可以在编写代码期间就能发现一些低级错误。
  Sublime Text 需要装两个插件：SublimeLinter + SublimeLinter-contrib-eslint

  eslint --init 
  初始化推荐选择
  -> Use a popular style guide
  -> Standard   不加分号
  -> JSON
  eslint 会创建一个 .eslintrc.json 的配置文件
  
  4.EditorConfig
  用于保持代码缩进风格一致
  Sublime Text 需要装一个插件：EditorConfig
  //.editorconfig 
    # editorconfig.org
    root = true

    [*]
    indent_style = space
    indent_size = 2
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
    tab_width = 2

    [*.md]
    trim_trailing_whitespace = false

    [Makefile]
    indent_style = tab

    trim_trailing_whitespace 用来删除每一行最后多余的空格，
    insert_final_newline 用来在代码最后插入一个空的换行。


## 准备配置文件
  将配置与代码分离是一个非常好的做法。我们通常将配置写到一个配置文件里，如 config.js 或 config.json ，并放到项目的根目录下。
  config-lite会根据环境变量（`NODE_ENV`）的不同加载 config 目录下不同的配置文件。
  如果不设置 `NODE_ENV`，则读取默认的 default 配置文件，如果设置了 `NODE_ENV`，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持 .js、.json、.node、.yml、.yaml 后缀的文件。
  如果程序以 `NODE_ENV=test node app` 启动，则 config-lite 会依次降级查找 `config/test.js`、`config/test.json`、`config/test.node`、`config/test.yml`、`config/test.yaml` 并合并 default 配置;

## 功能和路由设计
  1. 注册
    1. 注册页：`GET /signup`
    2. 注册（包含上传头像）：`POST /signup`
  2. 登录
      1. 登录页：`GET /signin`
      2. 登录：`POST /signin`
  3. 登出：`GET /signout`
  4. 查看文章
      1. 主页：`GET /posts`
      2. 个人主页：`GET /posts?author=xxx`
      3. 查看一篇文章（包含留言）：`GET /posts/:postId`
  5. 发表文章
      1. 发表文章页：`GET /posts/create`
      2. 发表文章：`POST /posts/create`
  6. 修改文章
      1. 修改文章页：`GET /posts/:postId/edit`
      2. 修改文章：`POST /posts/:postId/edit`
  7. 删除文章：`GET /posts/:postId/remove`
  8. 留言
      1. 创建留言：`POST /comments`
      2. 删除留言：`GET /comments/:commentId/remove`

  使用后端渲染，通过简单的 `<a>(GET)` 和 `<form>(POST)` 与后端进行交互
  如果使用前端渲染，要使用Ajax 与后端交互


## 会话
由于 HTTP 协议是无状态的协议，所以服务端需要记录用户的状态时，就需要用某种机制来识别具体的用户，这个机制就是会话（Session）

通过引入 express-session 中间件实现对会话的支持：

```js
app.use(session(options))
```

session 中间件会在 req 上添加 session 对象，即 req.session 初始值为 `{}`，当我们登录后设置 `req.session.user = 用户信息`，返回浏览器的头信息中会带上 `set-cookie` 将 session id 写到浏览器 cookie 中，那么该用户下次请求时，通过带上来的 cookie 中的 session id 我们就可以查找到该用户，并将用户信息保存到 `req.session.user`。

#### cookie 与 session 的区别

1. cookie 存储在浏览器（有大小限制），session 存储在服务端（没有大小限制）
2. 通常 session 的实现是基于 cookie 的，session id 存储于 cookie 中
3. session 更安全，cookie 可以直接在浏览器查看甚至编辑

## 页面通知
通过 connect-flash 中间件实现通知只显示一次，刷新后消失。
基于 session 实现
设置初始值 `req.session.flash={}`，通过 `req.flash(name, value)` 设置这个对象下的字段和值，通过 `req.flash(name)` 获取这个对象下的值，同时删除这个字段，实现了只显示一次刷新后消失的功能。

## 权限控制

没有登录的话只能浏览，登陆后才能发帖或写文章，即使登录了你也不能修改或删除其他人的文章。
将用户状态的检查封装成一个中间件，在每个需要权限控制的路由加载该中间件，即可实现页面的权限控制。
**middlewares/check.js**
```js
module.exports = {
  checkLogin: function checkLogin (req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录')
      return res.redirect('/signin')
    }
    next()
  },

  checkNotLogin: function checkNotLogin (req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录')
      return res.redirect('back')// 返回之前的页面
    }
    next()
  }
}
```
1. `checkLogin`: 当用户信息（`req.session.user`）不存在，即认为用户没有登录，则跳转到登录页，同时显示 `未登录` 的通知，用于需要用户登录才能操作的页面
2. `checkNotLogin`: 当用户信息（`req.session.user`）存在，即认为用户已经登录，则跳转到之前的页面，同时显示 `已登录` 的通知，如已登录用户就禁止访问登录、注册页面

## 路由初步实现
**routes/index.js**

```js
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
}
```

**routes/posts.js**

```js
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  res.send('主页')
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  res.send('发表文章')
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.send('发表文章页')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  res.send('文章详情页')
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章')
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章')
})

module.exports = router
```

**routes/comments.js**

```js
const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
  res.send('创建留言')
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
  res.send('删除留言')
})

module.exports = router
```

**routes/signin.js**

```js
const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('登录页')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('登录')
})

module.exports = router
```

**routes/signup.js**

```js
const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('注册页')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('注册')
})

module.exports = router
```

**routes/signout.js**

```js
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  res.send('登出')
})

module.exports = router
```

## **index.js**

```js
const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))
// flash 中间件，用来显示通知
app.use(flash())

// 路由
routes(app)

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
```

> 注意：中间件的加载顺序很重要。如上面设置静态文件目录的中间件应该放到 routes(app) 之前加载，这样静态文件的请求就不会落到业务逻辑的路由里；flash 中间件应该放到 session 中间件之后加载，因为 flash 是基于 session 实现的。

## 页面设计

使用 jQuery + Semantic-UI 实现前端页面的设计
**注册页**

**登录页**

**未登录时的主页（或用户页）**

**登录后的主页（或用户页）**

**发表文章页**

**编辑文章页**

**未登录时的文章页**

**登录后的文章页**

**通知**

### 组件

将模板拆分成组件使用<%- include('header') %>来复用
**nav**
**header**
**note**
**content**
**comments**
**footer**

### 变量挂载
优先级：`res.render` 传入的对象> `res.locals` 对象 > `app.locals` 对象，所以 `app.locals` 和 `res.locals` 几乎没有区别，都用来渲染模板，使用上的区别在于：`app.locals` 上通常挂载常量信息（如博客名、描述、作者这种不会变的信息），`res.locals` 上通常挂载变量信息，即每次请求可能的值都不一样

修改 index.js，在 `routes(app)` 上一行添加如下代码：

```js
// 使用package信息设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})
```

这样在调用 `res.render` 的时候就不用传入这四个变量了，express 自动结合并传入了模板，可以在模板中直接使用这四个变量。


## 数据库连接
使用Mongolass管理monggodb
Mongolass 保持了与 mongodb 一样的 api，又借鉴了许多 Mongoose 的优点，同时又保持了精简。

**lib/mongo.js**

```js
const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)
```
## 注册设计

### 1.用户模型设计

存储用户的名称、密码（加密后的）、头像、性别和个人简介这几个字段，对应修改 lib/mongo.js，添加如下代码：

**lib/mongo.js**

```js
exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
})
exports.User.index({ name: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一
```

定义了用户表的 schema，生成并导出了 User 这个 model，同时设置了 name 的唯一索引，保证用户名是不重复的。

> tips：`required: true` 表示该字段是必需的，`default: xxx` 用于创建文档时设置默认值。更多关于 Mongolass 的 schema 的用法，请查阅 [another-json-schema](https://github.com/nswbmw/another-json-schema)。

> tips：Mongolass 中的 model 你可以认为相当于 mongodb 中的 collection，只不过添加了插件的功能。

### 2.注册页面设计
> 注意：form 表单要添加 `enctype="multipart/form-data"` 属性才能上传文件。
修改 routes/signup.js 中获取注册页的路由如下：

**routes/signup.js**

```js
// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})
```

### 3.文件上传
使用 [express-formidable](https://www.npmjs.com/package/express-formidable) 处理 form 表单（包括文件上传）。修改 index.js ，在 `app.use(flash())` 下一行添加如下代码：

**index.js**

```js
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true// 保留后缀
}))
```

### 4.创建注册对应的数据库操作
新建 models/users.js，添加如下代码：

**models/users.js**

```js
const User = require('../lib/mongo').User

module.exports = {
  // 注册一个用户
  create: function create (user) {
    return User.create(user).exec()
  }
}
```

### 5.完善注册路由
    使用 express-formidable 处理表单的上传，表单普通字段挂载到 req.fields 上，表单上传后的文件挂载到 req.files 上，文件存储在 public/img 目录下。然后校验了参数，校验通过后将用户信息插入到 MongoDB 中，成功则跳转到主页并显示『注册成功』的通知，失败（如用户名被占用）则跳转回注册页面并显示『用户名已被占用』的通知。


    1.req.fields.name  获取用户提交信息
    2.try{校验用户输入}catch{失败，删除上传头像}
    3. 明文密码加密（并不安全）
      password = sha1(password)
    4.创建对象保存待加入数据库的信息
    5.使用 UserModel.create()方法插入数据库


## 登录与登出

### 完善登出路由
  登出后删除session中的用户信息req.session.user = null
  提示用户登出req.flash('success', '登出成功')然后跳转到主页

### 登录

    1.添加渲染登录页的代码 res.render('signin')
    2.添加登录页面ejs模板，表单提交登录信息
    3.完善登录验证，在models/users.js 添加 `getUserByName` 方法用于通过用户名获取用户信息：
        **models/users.js**

      ```js
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
        }
      }
      ```
    使用了 `addCreatedAt` 自定义插件（通过 \_id 生成时间戳）
    4.创建自定义插件，mongolass.plugin(pluginName, hooks）创建全局插件，注意处理findone and find
      **lib/mongo.js**

      ```js
      const moment = require('moment')
      const objectIdToTimestamp = require('objectid-to-timestamp')

      // 根据 id 生成创建时间 created_at
          item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
          return result
      
      ``` 
      注意处理findone and find

    5.完善登录路由
        1.get请求
            转到登录页
        2.post请求
            try{验证登录信息填写并跑出错误而}catch (e) {刷新提示并返回上一页}
            通过用户名获取用户信息并将密码加密后进行比较
            成功后刷新提示，将用户信息删除密码后加入session，跳转到主页

## 文章及主页

### 文章模型设计
    存储文章的作者 id、标题、正文和点击量
    在mongo.js中添加对应文章模型并按用户名正序以及创建时间降序排列
    exports.Post.index({ author: 1, _id: -1 }).exec()

### 发表文章功能设计
    1.创建发表文章页面，使用form上传文章信息
    2.完善路由
        2.1渲染文章页面
            ```js
            // 请求 /posts/create 发表文章页
            router.get('/create', checkLogin, function (req, res, next) {
              res.render('create')
            })
            ```
        2.2新建 models/posts.js 用来存放与文章操作相关的代码

        2.3 POST请求
          2.3.1 try{校验文章表单填写}catch（err）{刷新tips}
          2.3.2 创建对象存放信息
          2.3.3 调用 PostModel.create(post)将对象插入数据库
                成功后调用.then传入插入数据库后的post，刷新tips
                跳转到该文章的页面 res.redirect(`/posts/${post._id}`)

### 文章模型的完善
    **models/posts.js**
    1.在 PostModel 上注册 `contentToHtml`将 post 的 content 从 markdown 转换成 html
      post.content = marked(post.content)注意处理find and findone

    2.创建 getPostById 方法
      .findOne({ _id: postId })  通过文章 id 获取一篇文章，
      .populate({ path: 'author', model: 'User' })  根据post.author获取作者信息
      .addCreatedAt()  获取并保存创建时间
      .contentToHtml()  转换post内容

    3.创建 getPosts 方法,传入用户名author,如果author为空就获取所有文章，不为空就获取单个人的文章
      if(author)
      query.author = author
      return Post
      .find(query)    条件查询
      .populate({ path: 'author', model: 'User' })   查找对应作者
      .sort({ _id: -1 })    时间降序
      .addCreatedAt()  获取并保存创建时间
      .contentToHtml()  转换post内容

    4.创建incPv方法，根据文章id给文章的点击（pv）加1   $inc：指定数据增加
      return Post
        .update({ _id: postId }, { $inc: { pv: 1 } })

### 创建主页模板

      **views/posts.ejs**

      ```ejs
      <%- include('header') %>

      <% posts.forEach(function (post) { %>
        <%- include('components/post-content', { post: post }) %>
      <% }) %>

      <%- include('footer') %>
      ```
  遍历posts并传入post给post-content组件，并返回文章内容界面
  post-content组件接收一个post对象并利用post对象渲染单篇文章组件
  在使用post.content时应该使用 `<%- post.content %>`，因为在前面获取时转换为html了



### 完善跳转到主页（用户页）的路由

  在主页跳转路由**routes/posts.js**中
  将简单的页面渲染res.render('posts')
  修改为：
    ```js
    router.get('/', function (req, res, next) {
      const author = req.query.author

      PostModel.getPosts(author)
        .then(function (posts) {
          res.render('posts', {
            posts: posts
          })
        })
        .catch(next)
    })
    ```
    通过author获取文章，并渲染主页或者用户页，如果author为空就获取所有文章，不为空就获取单个人的文章


### 创建文章详情页模板
      **views/post.ejs**

      ```ejs
      <%- include('header') %>
      <%- include('components/post-content') %>
      <%- include('footer') %>
      ```
  
### 完善跳转到文章详情页的路由
    GET 请求 /posts/:postId 单独一篇的文章页
    获取 req.params.postId
    Promise.all([根据postId获取文章信息,增加文章点击量])
    成功 用获取的post渲染文章详情页面res.render('post', { post: post})

### 编辑和删除文章

      1. 修改 models/posts.js
        1.1 添加getRawPostById方法用于通过id获取内容未转换成html的文章
        1.2 添加updatePostById方法用于通过id更新文章
        1.3 添加delPostById方法用于通过id删除文章

      2. 创建编辑文章页面模板
        2.1 基本和创建文章一样，只是需要在对应地方加上原文章信息的显示

      3. 渲染编辑文章页面
        3.1 GET 请求  /posts/:postId/edit 更新文章页
           3.1.1 获取req.params.postId 和 req.session.user._id
           3.1.2 验证原文章是否存在
           3.1.3 存在的话就验证post.author._id与req.session.user._id是否相等
           3.1.4 相等就渲染文件编辑页面
        
        3.2 POST请求 /posts/:postId/edit 提交编辑文章
           3.2.1 校验 文章信息是否填写完毕
           3.2.2 校验 原文是否存在
           3.2.3 校验 post.author._id 与 req.session.user._id 是否相等
           3.2.4 根据 postid 更新数据库
           3.2.5 更新成功后 .then 返回上一页

        3.3 GET请求 /posts/:postId/remove 删除一篇文章
           3.3.1 获取req.params.postId 和 req.session.user._id
           3.3.2 验证原文章是否存在
           3.3.3 存在的话就验证 post.author._id 与 req.session.user._id 是否相等
           3.3.4 相等就根据 postid 删除数据库信息
           3.3.5 删除后 .then 刷新 tips 并返回主页
       
## 评论

### 评论模型设计

  存放评论用户id，评论内容。文章id
**lib/mongo.js**

      ```js
      exports.Comment = mongolass.model('Comment', {
        author: { type: Mongolass.Types.ObjectId, required: true },
        content: { type: 'string', required: true },
        postId: { type: Mongolass.Types.ObjectId, required: true }
      })
      exports.Comment.index({ postId: 1, _id: 1 }).exec()// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
      ```

### 创建评论列表组件

**views/components/comments.ejs**
  传入comments评论对象数组
  遍历显示 
  评论者的头像，评论者用户名（点击跳转到该用户页），评论时间，评论内容，判断当前登录用户是否作者显示删除按钮
  如果用户登录了就显示评论表单 将 postid 作为input的值 hidden 上传

将评论列表组件引入主页模板


### 创建评论操作
**models/comments.js**

  1. 自定义组件将评论内容转html
      Comment.plugin('contentToHtml',{})
  2. 创建评论操作模块
      module.exports = {
        创建评论  create：

        通过评论id获取评论    getCommentById： function create (){}

        通过评论id删除评论    delCommentById：

        通过postid删除文章下的所有评论    delCommentsByPostId：

        通过postid获取文章下的所有评论，并按事件升序   getComments：
        
        通过postid获取文章下的评论数   getCommentsCount：

    }

### 修改文章操作模板

   1.在 PostModel 上注册 `addCommentsCount` 用来给每篇文章添加留言数
    Post.plugin('addCommentsCount', {
      afterFind: function (posts) {
         return Promise.all(posts.map(function (post) {
           return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
              post.commentsCount = commentsCount
               return post
          })
       }))
     },
     afterFindOne同理

   2.在 `getPostById` 和 `getPosts` 方法里的 添加创建时间 后 添加 添加留言数 .addCommentsCount()

   3.修改delPostById，在删除文章后 添加删除该文章下所有评论 
      return CommentModel.delCommentsByPostId(postId)

### 修改文章页跳转路由

  获取该文章的所有评论
  
  以及在res.reder里加入评论传给ejs页面


### 完善评论路由

  POST请求 /comments 创建一条评论
      try{评论信息是否输入完整，不完整就抛出 自定义 Error('请填写留言内容') }catch{ 接收错误并刷新tips }
      创建对象保存评论信息： req.fields.postid  req.fields.ontent  req.session.user._id
      调用create方法将评论对象插入数据库，并刷新tips  res.redirect('back')返回上一页

  GET请求 /comments/:commentId/remove 删除一条评论
      根据 req.params.commentId 获取评论
      .then(function(comment){})  检验评论是否存在
      存在的话就根据 req.session.user._id 与 comment.author 是否相等检验登陆者是不是作者
      校验成功就根据 req.params.commentId 删除对应评论 并刷新tips  res.redirect('back')返回上一页


## 自定义404页面
    在index路由里添加
    ```js
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).render('404')
      }
    })
    ```
  然后创建 404.ejs 模板就可以实现自定义404页面了

## 错误信息显示

express 有一个内置的错误处理逻辑，如果程序出错，会直接将错误栈返回并显示到页面上。
如访问：`localhost:3000/posts/xxx/edit` 没有权限编辑的文章页，将会直接在页面中显示错误栈，如下：

```js
Error: 权限不足
    at /Users/nswbmw/Desktop/myblog/routes/posts.js:95:15
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
```

修改代码，实现复用页面通知。修改 index.js，在 `app.listen` 上面添加如下代码：

**index.js**

```js
app.use(function (err, req, res, next) {
  console.error(err)
  req.flash('error', err.message)
  res.redirect('/posts')
})
```

这里就实现了将错误信息用页面通知展示的功能，刷新页面将会跳转到主页并显示『权限不足』的红色通知。



待添加  归档  分类  上传图片
