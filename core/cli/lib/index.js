'use strict'
const pkg = require('../package.json')
const semver = require('semver')
const colors = require('colors')

const log = require('@flycc/log')
const { MIN_NODE_VERSION } = require('./constants')

/**
 * 检查版本号
 */
function checkPkgVersion() {
  log.notice('cli', '当前脚手架版本' + pkg.version)
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

function core() {
  // TODO
  // console.log('core执行了')
  try {
    // 检查入参
    checkInputArgs()
    // 检查当前脚手架版本
    checkPkgVersion()
    // 检查nodejs版本
    checkNodeVersion()
    // root用户降级处理
    checkRoot()
    // 执行初始化逻辑
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

module.exports = core
