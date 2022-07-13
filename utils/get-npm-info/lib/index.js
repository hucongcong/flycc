'use strict'
const axios = require('axios')
const semver = require('semver')
const npm_url = 'https://registry.npmmirror.com/'
function getNpmInfo() {
  console.log(1)
  // TODO
}

/**
 * 获取所有的npm版本
 */
async function getNpmVersion(pkgName) {
  const res = await axios.get(`${npm_url}${pkgName}`)

  if (res.data) {
    return Object.keys(res.data.versions)
  } else {
    return []
  }
}

/**
 * 获取npm最新的版本信息
 */
async function getLastestVersion(pkgName) {
  let versions = await getNpmVersion(pkgName)
  if (versions) {
    versions.sort((a, b) => {
      return semver.gt(b, a)
    })
    return versions[0]
  } else {
    return null
  }
}

module.exports = {
  getNpmInfo,
  getLastestVersion
}
