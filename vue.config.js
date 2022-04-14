const path = require('path')
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
    },
}
