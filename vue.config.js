import {defineConfig} from '@vue/cli-service'
export default defineConfig({
    transpileDependencies: ['@wharfkit'],
    productionSourceMap: false,
    configureWebpack: {
        devtool: 'source-map',
    },
    devServer: {
        allowedHosts: 'all',
        client: {
            webSocketURL: 'auto://0.0.0.0:0/ws',
        },
    },
})
