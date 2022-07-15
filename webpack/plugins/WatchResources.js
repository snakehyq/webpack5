/**
 * 当项目在开启观察者watch模式的时候，监听每一次资源的改动
 * 当每次资源变动了，将改动资源的个数以及改动资源的列表输出到控制台中
 * 监听结束之后，在控制台输出"监听结束了哦"
 */
class WatchResources {
    apply(complier) {
        const pluginName = WatchResources.name
        complier.hooks.watchRun.tapAsync(pluginName, (compiler, callBack) => {
            let fileWatchers = compiler.watchFileSystem.watcher.fileWatchers
            let filterFiles = Array.from(fileWatchers.keys()).filter(item => !(/node_modules/).test(item))
            if(filterFiles.length > 0) {
                console.log('一共监听了'+ filterFiles.length + '文件');
                console.log(filterFiles)
                console.log('------------分割线-------------')
            }
            callBack()
        })
        complier.hooks.watchClose.tap(pluginName, (complition) => {
            console.log('监听结束了哦.')
        })
    }
}

module.exports = WatchResources