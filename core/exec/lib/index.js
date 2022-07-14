'use strict'
const Package = require('@flycc/package')
const userHome = require('user-home')
const path = require('path')
const cp = require('child_process')
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
  // console.log(rootFile)
  if (rootFile) {
    // 在node主进程中调用
    // require(rootFile).call(null, Array.from(arguments))
    // 在node子进程中调用
    const args = Array.from(arguments)
    const cmd = args[args.length - 1]
    const o = Object.create(null)
    Object.keys(cmd).forEach((item) => {
      if (
        cmd.hasOwnProperty(item) &&
        !item.startsWith('_') &&
        item !== 'parent'
      ) {
        o[item] = cmd[item]
      }
    })
    args[args.length - 1] = o
    // console.log(args)
    const code = `require('${rootFile}').call(null, Array.from(${JSON.stringify(
      args
    )}))`
    const child = spawn('node', ['-e', code], {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    child.on('error', (err) => {
      console.log(err.message)
      process.exit(1)
    })
    child.on('exit', (e) => {
      console.log('命令执行成功' + e)
      process.exit(e)
    })
  }
}

// 兼容windows操作系统
function spawn(command, args, options) {
  const win32 = process.platform === 'win32'

  const cmd = win32 ? 'cmd' : command

  const cmdArgs = win32 ? ['-c'].concat(command, args) : args
  return cp.spawn(cmd, cmdArgs, options || {})
}

module.exports = index
