const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'js/main.js',
        clean: true
    },
    devtool: 'hidden-source-map',
    plugins: [
         // 打包体积分析
        new BundleAnalyzerPlugin(),
        // 抽取css
        new MiniCssExtractPlugin({
            // 抽取的文件名
            filename: 'css/[name].css',
        }),
        new OptimizeCssPlugin(),
    ],
    // 文件缓存
    cache: {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        }
    },
})