const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: ['@wharfkit'],
    productionSourceMap: false,
    configureWebpack: {
        devtool: 'source-map',
    },
})
