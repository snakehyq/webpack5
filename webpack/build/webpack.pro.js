const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FileList = require('../plugins/FileList')
const CleanDist = require('../plugins/CleanDist')

module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'js/main.[contenthash].js',
        clean: true
    },
    devtool: 'hidden-source-map',
    plugins: [
        // 自定义插件 CleanDist
        // new CleanDist({
        //     exclude: [
        //         'js/main.207bc19076ffa4e9f801.js'
        //     ]
        // }),
        // 自定义插件，打包后输出文件打包清单
        new FileList({
            filename: 'fileList.md'
        }),
         // 打包体积分析
        new BundleAnalyzerPlugin(),
        // 抽取css
        new MiniCssExtractPlugin({
            // 抽取的文件名
            filename: 'css/[name][contenthash].css',
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
    // 代码拆分
    optimization: {
        // runtimeChunk: {
        //     name: 'manifest'
        // },
        splitChunks: {//分割代码块
            cacheGroups: {
                vendor: {
                    //第三方依赖
                    priority: 1, //设置优先级，首先抽离第三方模块
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 1 //最少引入了1次
                },
                //缓存组
                common: {
                    //公共模块
                    chunks: 'initial',
                    name: 'common',
                    minSize: 100, //大小超过100个字节
                    minChunks: 3 //最少引入了3次
                }
            }
        }
    }
})