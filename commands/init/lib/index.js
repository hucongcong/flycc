'use strict'
const Command = require('@flycc/command')
class InitCommand extends Command {}

/**
 * 初始化项目的命令
 * @param {string} name 项目名称
 * @param {object} options 已经解析出来的当前命令的参数
 * @param {*} cmdObj 命令对象，可以获取到全局的命令参数
 */
function init(name, options) {
  console.log('init方法执行了, 啦啦啦')
  return new InitCommand()
}

module.exports = init
// module.exports.InitCommand = InitCommand
