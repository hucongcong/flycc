'use strict'

function hello() {
  return 'hello utils'
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = {
  hello,
  isObject
}
