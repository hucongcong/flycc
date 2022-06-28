'use strict'

const log = require('npmlog')

log.heading = 'hcc'
log.headingStyle = {
  fg: 'white',
  // underline: true
  inverse: true
}

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'

// 添加日志方法 成功
log.addLevel('success', 2000, {
  // 字体颜色
  fg: 'green',
  // bg: 'white',
  // bg: 'pink',
  // 是否加粗
  // bold: true,
  // 是否显示对立色，背景绿色，文字黑色
  inverse: true,
  // 是否带有下划线
  // underline: true,
  // 是否带有声音，可能会很烦人
  bell: true
})

module.exports = log
