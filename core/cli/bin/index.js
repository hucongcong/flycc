#! /usr/bin/env node

const importLocal = require('import-local')
const log = require('npmlog')

if (importLocal(__filename)) {
  // 如果加载了本地文件
  log.info('cli', '正在使用脚手架本地版本')
} else {
  require('../lib')(process.argv.slice(2))
}
