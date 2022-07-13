'use strict'
const { isObject } = require('@flycc/utils')
const pkgDir = require('pkg-dir').sync
const path = require('path')
const npmInstall = require('npminstall')
const pathExists = require('path-exists').sync
const { getLastestVersion } = require('@flycc/get-npm-info')
const fse = require('fs-extra')
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
    // 前缀
    this.prefix = this.packageName.replace('/', '_')
  }

  // _@flycc_init@1.0.10@@flycc
  get cacheFilePath() {
    return path.join(
      this.storePath,
      `_${this.prefix}@${this.version}@${this.packageName}`
    )
  }

  getLastestFilePath(version) {
    return path.join(
      this.storePath,
      `_${this.prefix}@${version}@${this.packageName}`
    )
  }

  async prepare() {
    // 如果缓存目录不存在
    if (this.storePath && !pathExists(this.storePath)) {
      fse.mkdirpSync(this.storePath)
    }
    if (this.version === 'latest') {
      this.version = await getLastestVersion(this.packageName)
    }
  }
  // 判断当前package是否存在
  async exist() {
    if (this.storePath) {
      await this.prepare()
      return pathExists(this.cacheFilePath)
    } else {
      // 指定了targetPath
      return pathExists(this.targetPath)
    }
  }

  // 安装package
  async install() {
    await this.prepare()
    await npmInstall({
      // 安装路径
      root: this.targetPath,
      // 安装的包的存储目录
      storeDir: this.storePath,
      // 仓库地址, 默认是 npmjs.com，使用淘宝镜像
      // registry: 'https://registry.npmmirror.com/',
      registry: 'https://registry.npmjs.org/',
      pkgs: [
        {
          name: this.packageName,
          version: this.version
        }
      ]
    })
  }

  // 更新Package
  async update() {
    await this.prepare()
    // 1. 判断缓存的package是否是最新的版本
    const cacheVersion = await getLastestVersion(this.packageName)
    // 2. 最新的版本对应的文件路径
    const cacheFilePath = this.getLastestFilePath(cacheVersion)
    // 3. 判断缓存的package是否存在
    if (!pathExists(cacheFilePath)) {
      // 4. 如果不存在，则安装最新的版本
      await npmInstall({
        // 安装路径
        root: this.targetPath,
        // 安装的包的存储目录
        storeDir: this.storePath,
        // 仓库地址, 默认是 npmjs.com，使用淘宝镜像
        registry: 'https://registry.npmjs.org/',
        pkgs: [
          {
            name: this.packageName,
            version: latestVersion
          }
        ]
      })
    } else {
      console.log('已经是最新版本了，无需更新')
    }
  }

  // 获取入口文件的路由
  getRootFile() {
    const dir = pkgDir(this.targetPath)
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
