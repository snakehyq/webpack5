/**
 * 对字符串做反转操作
 * @param {.txt 文件里的内容} source 
 * @returns 
 */
module.exports = function (source) {
    if(source) {
        source = source.split('').reverse().join('')
        console.log(source);
    }
    return source
}