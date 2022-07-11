'use strict'

module.exports = init

/**
 * 初始化项目的命令
 * @param {string} name 项目名称
 * @param {*} cmdObj 命令对象
 */
function init(name, cmdObj) {
  console.log('init方法执行了', name, cmdObj)
}
