import path from 'path'
import fs from 'fs'
import micromatch from 'micromatch'
// const rootPath = path.resolve('.')
const envType = process.argv.slice(2)[0]
const distPath = 'dist'
const maxFileSize = 20 << 20 // 20M
const cacheFileNmae = 'cachelist.js'
const networkList = (() => {
  if (envType === 'test_local') {
    return ['localhost']
  }
  if (envType === 'test') {
    return ['sepolia', 'arbitrumSepolia', 'bscTestnet', 'optimismSepolia', 'polygonMumbai']
  }
  return ['ethereum', 'arbitrum', 'bsc', 'optimism', 'polygon']
})()
const includesFileList = ['/'].concat(networkList.map(item => `/${item}`)).concat(networkList.map(item => `/${item}/invite`))
const blacklist = ['dist.zip',  '.well-known', '.well-known/*',]
/**
 *
 * @param {String} currentDirPath
 * @returns {String[]}
 */
function walkSync (currentDirPath) {
  // http://nodejs.cn/api/fs.html#fsreaddirsyncpath-options
  // http://nodejs.cn/api/fs.html#class-fsdirent 新增于: v10.10.0
  const direntList = fs.readdirSync(currentDirPath, { withFileTypes: true })
  const fileList = direntList
    .filter(dirent => dirent.isFile())
    .map(dirent => path.join(currentDirPath, dirent.name))
    .filter(filePath => fs.statSync(filePath).size <= maxFileSize)

  return direntList
    .filter(dirent => dirent.isDirectory())
    .map(dirent => walkSync(path.join(currentDirPath, dirent.name)))
    .reduce((a, b) => a.concat(b), [])
    .concat(fileList)

  // return fileList
}
// console.log('\\\\js\\\\chunk-5b49b23e.b6a13b53.js'.replace(/\\\\/g, '/'))
const fileList = walkSync(distPath)
  .map(str => str.replace(distPath, ''))
  .map(str => str.replace(/\\/g, '/'))
const fileListAll = fileList.includes(`/${cacheFileNmae}`)
  ? fileList.concat(includesFileList)
  : fileList.concat([`/${cacheFileNmae}`, ...includesFileList])
// const fileListAll = fileListAllTemp.map(item => micromatch.isMatch(item, '/assets/materialdesignicons-webfont-*') ? [`${item}?v=${materialdesigniconsWebfontVersion}`, item] : item).flat()
// ''..startsWith('2')
const patterns = blacklist.map(item => (item.startsWith('/') ? item : `/${item}`)).map(item => `!${item}`)
const content = `
var versionTime = '${new Date().getTime()}${Math.floor(Math.random() * 1000)}'
var cachelist = ${JSON.stringify(micromatch(fileListAll, patterns)).replace(/"/g, "'")}
`
fs.writeFileSync(path.join(distPath, 'cachelist.js'), content)
// console.log(data)
