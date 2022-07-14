'use strict'
const MIN_NODE_VERSION = '12.0.0'
const semver = require('semver')
const colors = require('colors')
const log = require('@flycc/log')
class Command {
  constructor(argv) {
    console.log('command constructor')
    this._argv = argv

    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain = chain.then(() => {
        this.checkNodeVersion()
      })
      chain.then(() => this.initArgs())
      chain.then(() => this.init())
      chain.then(() => this.exec())
      chain.catch((err) => {
        // console.log('我会执行吗')
        log.error(err.message)
      })
    })
  }

  /**
   * 检查nodejs版本
   */
  checkNodeVersion() {
    const nodeVersion = process.version
    // 对比版本
    if (semver.lt(nodeVersion, MIN_NODE_VERSION)) {
      throw new Error(
        colors.red('当前nodejs版本过低，请升级至' + MIN_NODE_VERSION + '以上')
      )
    }
    // console.log('代码执行了')
  }

  initArgs() {
    if (!this._argv) return log.error('参数不能为空')
    if (!Array.isArray(this._argv)) return log.error('参数必须是一个数组')
    this._command = this._argv[this._argv.length - 1]
    this._argv = this._argv.slice(0, -1)
    console.log(this._argv)
  }

  init() {
    log.error('Command类init方法必须实现')
  }

  exec() {
    log.error('Command类exec方法必须实现')
  }
}

module.exports = Command
