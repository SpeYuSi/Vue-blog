## 用于存放测试文件 


使用 mocha 和 supertest 进行测试 

安装模块
    npm i mocha supertest --save-dev
    npm i istanbul --save-dev   生成测试覆盖率

在package.json中添加运行脚本：
    "test": "mocha test"

要测试覆盖率的话，应修改为：
    "test": "istanbul cover _mocha"
    windows要修改为 "test": "istanbul cover node_modules/mocha/bin/_mocha"

指定执行 test 目录的测试。修改 index.js，将：

**index.js**

```js
// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
```

修改为:

```js
if (module.parent) {
  // 被 require，则导出 app
  module.exports = app
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
  })
}
```
如果 index.js 被 require 了，则导出 app，否则就直接启动 index.js ，通常用于测试。


使用signup.js模拟访问注册页面还有很多测试没有完成
