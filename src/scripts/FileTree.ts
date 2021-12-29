namespace FileTree {
    const fs = require("fs");
    const path = require("path");
    const myLog = require('../scripts/ErrorLog').myLog;

    interface TreeNode {
        dir: string  //
    }

    /**
     * @description 获取文件树(可指定层数)
     * @param {string} dir 根目录
     * @param {number} [depth = 1] 深度(depth<=0表示获取完整树)
     */
    export const getDirTree = (dir: string, depth: number = 1) => {

    }

    // const _deepTree = (rootNode) => {
    //
    // }

    /**
     * @description 是否为文件(此处简单地将所有文件分为file和dir两类)
     * @param dir 目标
     */
    export const _isFile = (dir: string) => {
        try {
            return fs.statSync(dir).isFile()
        } catch (e) {
            myLog('ERROR', e)
            return null
        }

    }
}

const getDirTree = FileTree.getDirTree

// export {
//     getDirTree
// }
console.time('is')
let is = FileTree._isFile('../script')
console.log(is)
console.timeEnd('is')