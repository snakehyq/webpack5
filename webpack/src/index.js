import './index.less'
class TestSb {
    constructor(flag) {
        this.sb = flag
    }
}
let sb = new TestSb(true)

console.log(process.env.NODE_ENV);


import _ from 'lodash'

console.log(_.join(['a', 'b', 'c']))