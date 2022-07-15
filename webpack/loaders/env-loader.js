/**
 * 在开发的工程中，线上环境需要引入一些统计和打印日志的js文件。
 * 但是对于开发环境，加速打包速度减少页面渲染时间很关键。我于是想根据开发环境，写一个简单的loader,按需加载一些资源。
 * 为了完成按需加载的功能。打算使用自定义的loader。 
 * 实现思路如下：
    1.添加js loader 对index.js进行处理
    2.解析envLoader函数
    3.拿到传入的参数并根据环境判断是否加载。
 *  将使用以下api:
    loader-utils
    schema-utils
    this.async
    this.cacheable
    getOptions
    validateOptions
    urlToRequest
 */
// 用于保证 loader 选项，进行与 JSON Schema结构一致的校验
// 与options和定义的JSON Schema进行结构一致的校验
// validate(options, JSON Schema)
const json = {
    type: 'object',
    propertiese: {
        constent: {
            type: 'string'
        }
    }
} 
const validate = require('schema-utils')
module.exports = function (source) {
    // 设置当前的loader启动缓存
    this.cacheable()
    // 采用异步loader，loader分为同步loader(默认值)和异步loader
    let callback = this.async()
    // 拿到loader的option选项（{env:'dev'}
    const options = this.getOptions()
    console.log('options', options);
    // 进行校验
    validate(json, options, 'env-loader')
}