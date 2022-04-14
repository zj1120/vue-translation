#! node
const fs = require('fs')
const path = require('path')
const SHA256 = require('crypto-js/sha256')
const YAML = require('yamljs')
const chalk = require('chalk')

// 用来保存当前文件中存在翻译的key
const exitObj = {}

// 获取对应的翻译文字
const getValue = (hash) => {
  const yamlData = YAML.parse(fs.readFileSync(path.resolve('./src/assets/i18n/translationFile.yml'), 'utf-8'))
  const obj = yamlData ? yamlData[hash] : {}
  return {
    enStr: obj?.en || ''
  }
}

const transferFile = (filePath) => {
  // const fileKey = filePath.replace(/^.+\/assets\//, '').replace(/\.vue/g, '').replace(/\//g, '.')
  const file = fs.readFileSync(filePath, 'utf-8')

  // 匹配除去'和"的其余所有标点符号
  // eslint-disable-next-line no-useless-escape
  const reg = /\$spt\((['"])([\u4e00-\u9fa5a-zA-Z0-9\s\,\.\/\;\[\]\\\`\-\=\<\>\?\:\{\}\|\~\!\@\#\$\%\^\&\*\(\)\_\+\，\。\/\；\‘\【\】\、\·\-\=\《\》\？\：\“\”\「\」\|\～\！\@\#\¥\%\…\&\*\（\）\—\+]+)['"]/g
  let result = reg.exec(file)
  while (result) {
    const zhCnStr = result[2] // '如果使用“@”符号，请使用转译符号，如“\\@”'
    const hashStr = SHA256(zhCnStr.replace(/\\\\/g, '\\'))
    const { enStr } = getValue(hashStr)
    if (!exitObj[hashStr]) {
      const obj = {
        enStr,
        zhCnStr
      }
      exitObj[hashStr] = obj
    } else if (!exitObj[hashStr].enStr) {
      exitObj[hashStr].enStr = enStr
    }

    result = reg.exec(file)
  }
}

const readDirSync = (dirPath) => {
  const pa = fs.readdirSync(dirPath)
  pa.forEach((ele) => {
    const currentPath = path.join(dirPath, ele)
    const info = fs.statSync(currentPath)

    // 文件夹则继续递归
    if (info.isDirectory()) {
      readDirSync(currentPath)
    } else if ((ele.endsWith('.vue') || ele.endsWith('.js')) && (ele !== 'translation.js')) {
      // .vue、.js文件
      transferFile(currentPath)
    }
  })
}

const mkdirSync = (dir, cb) => {
  const paths = dir.split('/')
  function next(index) {
    if (index > paths.length) {
      return cb()
    }
    const newPath = paths.slice(0, index).join('/')
    fs.access(newPath, (err) => {
      if (err) {
        fs.mkdir(newPath, () => {
          next(index + 1)
        })
      } else {
        next(index + 1)
      }
    })
  }
  next(1)
}

const writeFile = () => {
  try {
    // src目录下进行递归遍历
    readDirSync(path.resolve('./src'))

    let targetStr = ''
    Object.entries(exitObj).forEach(([key, val]) => {
      const { enStr, zhCnStr } = val
      targetStr += `${key}:\n  zh-CN: "${zhCnStr}"\n  en: "${enStr}"\n`
    })

    fs.writeFileSync('./src/assets/i18n/translationFile.yml', targetStr, 'utf-8')

    console.log(chalk.green(`translationFile.yml 翻译完成！`))
  } catch (e) {
    console.log(chalk.red(`translationFile.yml 翻译失败！`))
  }
}

const geneFile = async() => {
  await mkdirSync('./src/assets/i18n', () => {
    console.log(chalk.green(`created ./src/assets/i18n/translationFile.yml`))
    try {
      fs.statSync(path.resolve('./src/assets/i18n/translationFile.yml'))
      writeFile()
    } catch (e) {
      fs.writeFileSync('./src/assets/i18n/translationFile.yml', '', 'utf-8')
      writeFile()
    }
  })
}

geneFile()
