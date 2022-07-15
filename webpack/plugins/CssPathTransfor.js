/**
 * 小程序mpvue项目，通过webpack编译，生成子包（我们作为分包引入到主程序中），
 * 然后考入主包当中。生成子包后，里面的公共静态资源wxss引用地址需要加入分包的前缀：/subPages/enjoy_given。
 * 在未编写插件前，生成的资源是这样的，这个路径如果作为分包引入主包，是没法正常访问资源的。
 */
class CssPathTransfor {
    apply(compiler) {
        // 拿到当前插件的名称
        const pluginName = CssPathTransfor.name
        compiler.hooks.emit.tap(pluginName, (compilation, callback) => {
            // console.log(2,compilation.assets);
            // 拿到资源后，遍历所有资源
        })
        
    }
}

module.exports = CssPathTransfor