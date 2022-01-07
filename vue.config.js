module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,

            // 打包配置
            builderOptions: {
                appId: 'com.catExplorer.app',
                productName: 'cat-explorer',
                win: {
                    icon: 'public/logo.ico'
                }
            },

        }
    }
}
