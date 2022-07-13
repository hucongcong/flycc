'use strict'
const Package = require('@flycc/package')
const userHome = require('user-home')
const path = require('path')
const SETTINGS = {
  init: '@flycc/init'
}

async function index() {
  // TODO
  //   console.log(process.env.CLI_TARGET_PATH, 123)
  // 1. 根据targetPath获取到modulePath
  // 2. 将modulePath生成Package(npm模块)
  // 3. 根据Package.getRootFile(获取入口文件)
  let targetPath = process.env.CLI_TARGET_PATH
  let storePath
  let pkg
  const packageName = this.name()
  const version = 'latest'
  // 如果没有指定缓存目录，则使用默认的缓存目录
  if (!targetPath) {
    targetPath = path.join(userHome, '.flycc', 'dependencies')
    storePath = path.join(targetPath, 'node_modules')
    // 如果包不存在
    pkg = new Package({
      targetPath,
      packageName: SETTINGS[packageName] || packageName,
      version,
      storePath
    })
    // 判断包是否存在
    if (await pkg.exist()) {
      // 更新包
      // 获取所有的版本
      await pkg.update()
    } else {
      // 安装包
      await pkg.install()
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName: SETTINGS[packageName] || packageName,
      version
    })
  }
  // console.log(await pkg.exist())
  // 获取入口文件的路由
  const rootFile = pkg.getRootFile()
  console.log(rootFile)
  if (rootFile) {
    require(rootFile).apply(null, arguments)
  }
}

module.exports = index
