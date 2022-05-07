# vue-translation使用方法

1. 安装yaml-loader(npm i yaml-loader --save-dev)
2. vue.config.js配置yaml-loader解析，示例：
    ```JS
        module.exports = {
            chainWebpack: (config) => {
                config.module.rule('yaml')
                .test(/\.ya?ml$/)
                // 指定到某个目录下的文件，如果项目有其它目录用到.yaml文件可以指定到src目录就行了
                .include.add(path.join(__dirname, 'src/assets/i18n'))
                .end()
                .type('json')
                .use("json-loader")
                .loader("yaml-loader")
                .end()
            }
        }
    ```
3. 中文需要使用$spt('中文')函数包裹起来，js文件和vue文件中都需要
4. $spt()函数不得换行,由于脚本没有匹配\n，不做这个匹配是因为希望统一格式
5. $spt()函数使用单引号包裹中文：$spt('中文')
6. 每次添加或修改中文后需要执行：npx translation 来生成新的翻译文件
7. 修改语言用this.$i18n.locale = lang

