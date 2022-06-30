const marked = require('marked')

function markdownLoader(source) {
    const options = this.getOptions()
    const html = marked.parse(source, options)
    const code = `module.exports = ${JSON.stringify(html)}`
    return code
}

module.exports = markdownLoader