import {defineConfig} from '@vue/cli-service'
export default defineConfig({
    transpileDependencies: ['@wharfkit'],
    productionSourceMap: false,
    configureWebpack: {
        devtool: 'source-map',
    },
})
