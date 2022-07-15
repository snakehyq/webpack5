const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const WatchResources = require('../plugins/WatchResources')
module.exports = smp.wrap(
  merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        // 自定义插件 watch-resources
        new WatchResources(),
    ],
    // 服务
    devServer: {
        port: '3200', // 端口
        hot: true,
        compress: true, // 是否启用gzip压缩
        proxy: {
            '/api': {
                target: 'http://xxxx',
                ws: true, // 是否启用websockets
                //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
                changOrigin: true,
                pathRewrite: {
                    '^/api': '',
                }
            }
        }
    },
    // 内存缓存
    cache: {
        type: 'memory'
    }
}))