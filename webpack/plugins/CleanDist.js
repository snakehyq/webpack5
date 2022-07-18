/**
 * 1.此插件在哪个钩子函数中执行
 * 2.如何获取旧的dist文件夹中的所有文件
 * 3.如何获取新生成的所有文件，以及options.exclude中的文件名称，并合并为一个无重复项的数组
 * 4.如何将旧的所有文件和新的所有文件做一个对比得出需要删除的文件列表
 * 5.如何删除被废弃的文件
 * recursive-readdir-sync 它的作用就是以递归方式同步读取目录路径的内容
 *  https://github.com/battlejj/recursive-readdir-sync github网址
 * 
 *  minimatch 需要用到一个minimatch的工具库，它很适合用来做这种文件路径的匹配
 * 
 *   union 合并无重复项我们可以使用lodash.union方法，lodash它是一个高性能的 JavaScript 实用工具库，
 *   里面提供了许多的方法来使我们更方便的操作数组、对象、字符串等。
 *   而这里的union方法就是能把多个数组合并成一个无重复项的数组，
 *  */ 
const recursiveReadSync = require('recursive-readdir-sync')
const minimatch = require("minimatch");
const union = require("lodash.union");
const path = require("path")
const fs = require("fs")
class CleanDist {
    constructor(options) {
        this.options = options || {}
    }
    apply(compiler) {
        const outputPath = compiler.options.output.path
        const pluginName = CleanDist.name
        compiler.hooks.done.tapAsync(pluginName, (stats) => {
            const assetsName = stats.toJson().assets.map(item => item.name)
            // 编译后的最新的资源文件,与this.options.exclude进行合并并且去重
            const newAssets = union(this.options.exclude, assetsName)
           // 获取未匹配文件
           const umatchFiles = this.getUnmatchFiles(outputPath, newAssets)
           // 删除未匹配的文件
           umatchFiles.forEach(fs.unlinkSync)

        })
    }
    // 获取未匹配文件
    getUnmatchFiles(outputPath, newAssets = []) {
        // 根据输出目录，拿到目录下的文件
        return recursiveReadSync(outputPath).filter(file => 
            newAssets.every(asset => {
                return !minimatch(path.relative(outputPath, file), asset, {
                    dot: true
                })
            })    
        )
    }
}

module.exports = CleanDist


