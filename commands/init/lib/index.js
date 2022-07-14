'use strict'
const Command = require('@flycc/command')
class InitCommand extends Command {
  init() {
    console.log('init')
    this.projectName = this._argv[0] || ''
    this.force = this._argv[1].force
    console.log(this.projectName, this.force)
  }
  exec() {
    console.log('exec')
  }
}

/**
 * 初始化项目的命令
 * @param {string} name 项目名称
 * @param {object} options 已经解析出来的当前命令的参数
 * @param {*} cmdObj 命令对象，可以获取到全局的命令参数
 */
function init(argv) {
  console.log('init方法执行了, 啦啦啦')
  return new InitCommand(argv)
}

module.exports = init
// module.exports.InitCommand = InitCommand
