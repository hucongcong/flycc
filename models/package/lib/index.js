'use strict'
const { isObject } = require('@flycc/utils')
const pkgDir = require('pkg-dir').sync
const path = require('path')
const npmInstall = require('npminstall')
class Package {
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('Package类的options参数必须是一个对象')
    }
    // package的路径
    this.targetPath = options.targetPath
    // package的缓存路径
    this.storePath = options.storePath
    // package的名称
    this.packageName = options.packageName
    // package的版本
    this.version = options.version
  }

  // 判断当前package是否存在
  exist() {}

  // 安装package
  async install() {
    await npmInstall({
      // 安装路径
      root: this.targetPath,
      // 安装的包的存储目录
      storeDir: this.storePath,
      // 仓库地址, 默认是 npmjs.com，使用淘宝镜像
      registry: 'https://registry.npmmirror.com/',
      pkgs: [
        {
          name: this.packageName,
          version: this.version
        }
      ]
    })
  }

  // 更新Package
  update() {}

  // 获取入口文件的路由
  getRootFile() {
    const dir = pkgDir(this.targetPath)
    console.log(dir)
    if (dir) {
      const pkgFile = require(path.join(dir, 'package.json'))
      if (pkgFile && pkgFile.main) {
        return path.join(dir, pkgFile.main)
      }
    }
    return null
  }
}

module.exports = Package
