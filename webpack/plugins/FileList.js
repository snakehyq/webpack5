/**
 * 在每次webpack打包之后，自动产生一个打包文件清单，
 * 实际上就是一个markdown文件，上面记录了打包之后的文件夹dist里所有的文件的一些信息。
 * 
 * 思路：
 * 首先要确定我们的插件是不是需要传递参数进去
 * 确定我们的插件是要在那个钩子函数中执行
 * 我们如何创建一个markdown文件并塞到dist里
 * markdown文件内的内容是长什么样的
 */
class FileList {
    static defaultOptions = {
        filename: 'fileName.md'
    }
    constructor(options) {
        this.options = { ...FileList.defaultOptions, options }
    }
    apply(compiler) {
        // 拿到插件的名字
        const pluginName = FileList.name
        compiler.hooks.emit.tapAsync(pluginName, (compilation, callBack) => {
            let content = '# In this build:\n\n' + Object.keys(compilation.assets).map(item => `- ${item}`).join('\n')
            compilation.assets[this.options.filename] = {
                source: function () {
                    return content
                },
                size: function () {
                    return content.length
                }
            }
            callBack()
        })
    }
}

module.exports = FileList