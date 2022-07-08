'use strict'
const pkg = require('../package.json')
const semver = require('semver')
const colors = require('colors')

const { program } = require('commander')

const log = require('@flycc/log')
const { MIN_NODE_VERSION } = require('./constants')
const path = require('path')

/**
 * 检查版本号
 */
function checkPkgVersion() {
  // log.notice('cli', '当前脚手架版本' + pkg.version)
}

/**
 * 检查nodejs版本
 */
function checkNodeVersion() {
  const nodeVersion = process.version
  // 对比版本
  if (semver.lt(nodeVersion, MIN_NODE_VERSION)) {
    throw new Error(
      colors.red('当前nodejs版本过低，请升级至' + MIN_NODE_VERSION + '以上')
    )
  }
}

/**
 * 检查是否是管理员账户
 */
function checkRoot() {
  // console.log(process.geteuid())
  // root用户降级处理，防止mac本上出现权限问题
  const rootCheck = require('root-check')
  rootCheck()
}

/**
 * 检查环境变量
 */
function checkEnv() {
  // 获取userHome
  const userHome = require('os').homedir()
  // console.log(userHome)
  const config = require('dotenv').config({
    path: path.join(userHome, '.flycc')
  })
  // console.log('环境变量', config)
}

function core() {
  // console.log('core执行了')
  try {
    // 检查入参
    // checkInputArgs()
    // 检查当前脚手架版本
    checkPkgVersion()
    // 检查nodejs版本
    checkNodeVersion()
    // root用户降级处理
    checkRoot()
    // 检查环境变量
    checkEnv()
    // 检查是否有新的版本
    checkGlobalUpdate()
    // 执行初始化逻辑
    // 注册命令
    registerCommand()
    log.success('cli', '初始化成功')
    log.verbose('cli', 'debug模式开启')
  } catch (e) {
    log.error(e.message)
  }
}

/**
 * 检查入参
 */
function checkInputArgs() {
  const minimist = require('minimist')
  const args = minimist(process.argv.slice(2))

  if (args.debug) {
    // 在debug模式下
    log.level = 'verbose'
  }
}

/**
 * 检查是否需要全局更新
 */
function checkGlobalUpdate() {
  // 1. 获取当前的版本号和模块名（从package.json中获取）
  const currVersion = pkg.version
  const currName = pkg.name
  // console.log(currVersion, currName)
  // 2. 调用npm的api,获取到最新的版本号, 重新写一个包，方便后续复用
  // 3. 和当前版本进行比对
}

/**
 * 注册命令
 */
function registerCommand() {
  program
    .version(pkg.version)
    .name(Object.keys(pkg.bin)[0])
    .description('hcc自定义的脚手架，用于快速初始化项目和一键部署')
    .usage('<command> [options]')
    .option('-d --debug', '是否开启调试模式', false)

  // 监听debug事件
  program.on('option:debug', () => {
    if (program.debug) {
      // 在debug模式下
      log.level = 'verbose'
    } else {
      log.level = 'info'
    }
  })

  // 处理未知的命令
  program.on('command:*', (obj) => {
    // console.log(obj)
    const availableCommands = program.commands.map((cmd) => {
      // console.log(cmd)
      return cmd.name()
    })
    console.log(colors.red('未知的命令 ' + obj[0]))
    if (availableCommands.length > 0) {
      console.log(colors.green('可用命令' + availableCommands.join(',')))
    }
  })

  if (process.argv.length < 3) {
    // 提供帮助信息
    program.help()
  } else {
    program.parse(process.argv)
  }
}

module.exports = core
