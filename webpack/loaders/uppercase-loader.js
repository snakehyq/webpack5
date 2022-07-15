/**
 * 首字母大写
 * @param {*反转loader处理的结果} source 
 * @returns 
 */
module.exports = function (source) {
    if(source) {
        source = source.charAt(0).toUpperCase() + source.slice(1)
        console.log(source);
    }
    return `module.exports = '${ source }'`
}