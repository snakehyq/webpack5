class DecideHTmlWebpack {
    apply(compiler) {
        const pluginName = DecideHTmlWebpack.name
        compiler.hooks.afterPlugins.tap(pluginName, (compiler) => {
            const plugins = compiler.options.plugins
            const flag = plugins.some(plugin => plugin.__proto__.constructor.name === 'HtmlWebpackPlugin')
            if(flag) {
                console.log('使用了html-webpack-plugin')
            }
        })
    }
}

module.exports = DecideHTmlWebpack