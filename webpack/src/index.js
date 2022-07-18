import './index.less'
import txt from './index.txt'
class TestSb {
    constructor(flag) {
        this.sb = flag
    }
}
// 热模块部署 - 在入口文件中新增:
if(module && module.hot) {
    module.hot.accept()
}


let sb = new TestSb(true)
import _ from 'lodash'
