/// background
/// 其中所有的私有方法都为同步方法(sync), 出错或不满足返回条件则返回值为null
// import {FileTreeNode} from "@/scripts/interface";
/**
 * @description 解析后的文件树
 */
interface FileTreeNode {
    // 节点的id - 可用作表格的row-key
    uuid: string
    // 目录/文件
    type: 'DIR' | 'FILE'
    // 根目录/磁盘名
    root: string
    // 文件名+扩展名
    base: string
    // 文件名
    name: string
    // 扩展名
    ext: string
    // 绝对路径
    dir: string
    // 是否获取了子目录信息
    ifDeep: boolean
    // 子目录
    children?: FileTreeNode[]
}

namespace FileTree {
    const fs = require("fs");
    const path = require("path");
    const uuid = require("uuid").v4;
    const myLog = require("./Logger").myLog;
    const dfs = require('lopo-lib').dfs

    // region 接口
    // @ts-ignore
    import {FileTreeNode} from "@/scripts/interface";
    // endregion

    // region 类
    /**
     * @description 文件树类
     * <br/>使用class来存储当前的文件树对象, 给文件树添加一些额外操作方法
     */
    export class FileTree {
        /**
         * @description 文件树对象
         */
        tree: FileTreeNode = {} as FileTreeNode

        /**
         * @description 是否已经初始化
         */
        ifInit: boolean = false

        /**
         * @description 传入路径, 以此为根构建文件树类
         */
        init(rootPath: string): boolean {
            if(Object.keys(this.tree).length !== 0) return false
            else {
                let tree = getDirTree([rootPath])
                if(tree === null) return false
                else {
                    this.tree = tree
                    this.ifInit = true
                    return true
                }
            }
        }

        /**
         * @description 传入当前树的某个节点的uuid, 尝试展开1层其子树
         * @deprecated
         */
        expand(nodeId: string): boolean {
            if(Object.keys(this.tree).length === 0) return false
            else {
                const rootPath = dfs(this.tree, null, 'children', (node: FileTreeNode) => {return node.dir})
                const tree =  getDirTree([rootPath])
                if(tree === null) return false
                else {
                    console.log(tree)
                    return true
                }
            }
        }

        /**
         * @description 清空树(触发gc)
         */
        clear() {
            this.tree = {} as FileTreeNode
            this.ifInit = false
        }
    }
    // endregion

    // region 方法
    /**
     * @description 获取目标路径为根节点的文件树(可指定层数)
     * <br/>深度depth<=0表示获取完整树, 默认为1
     */
    const getDirTree = (dir: string[], depth: number = 1): FileTreeNode | null => {
        return _deepGrowTree(dir, depth, 0)
    }

    /**
     * @description 递归深入获取文件树
     * <br/>dir: 目标目录; depth: 目标深度(depth<=0表示不限制深度); current: 当前所在层数;
     */
    const _deepGrowTree = (dir: string[], depth: number = 1, current: number = 0) => {
        const _thisNodeInfo = _getFileInfo(...dir)  // 获取当前目录的详细信息

        if(_thisNodeInfo === null) return null  // 当前节点出错则返回null
        else {  // 构建当前节点信息
            const _thisNode: FileTreeNode = { ..._thisNodeInfo }

            if(_thisNode.type === 'DIR') {
                _thisNode.children = []  // 当前节点为文件夹则添加children字段
                if(depth <= 0 || current < depth) {  // 当前深度小于目标深度(或depth值小于等于0)则继续深入
                    current += 1  // 更深入1层
                    _thisNode.ifDeep = true  // 标记为已经获取子目录信息
                    const _childList = _getChildFileList(...dir)  // 获取子文件名列表, 用于拼接子文件的文件路径
                    if(_childList !== null) {  // 一般获取子目录不会出错 =_=!
                        for(let i = 0 ; i < _childList.length; i ++) {
                            const _childTree = _deepGrowTree([...dir, _childList[i]], depth, current)
                            if(_childTree !== null) {  // 如果子树不为空则附加到父节点
                                _thisNode.children.push(_childTree)
                            }
                        }
                    }
                }
            }

            return _thisNode
        }
    }

    /**
     * @description 获取目标目录的子文件名列表
     * <br/>目标目录非文件夹 => 返回null
     */
    const _getChildFileList = (...dir: string[]): string[] | null => {
        try {
            const _dir: string = path.resolve(...dir)
            return fs.readdirSync(_dir)
        }
        catch (e) {
            myLog('ERROR', e.toString())
            return null
        }
    }

    /**
     * @description 获取目标目录的文件信息
     * <br/>目标非文件或文件夹或不存在 => 返回null
     */
    const _getFileInfo = (...dir: string[]): FileTreeNode | null => {
        try {
            const _dir: string = path.resolve(...dir)
            const _type = _getFileType(_dir)

            if(_type === null) return null
            else {
                const _parsedPath = path.parse(_dir)!
                return {
                    uuid: uuid(),
                    type: _type,
                    ..._parsedPath,
                    ifDeep: false  // 默认都是未获取子目录信息
                }
            }
        }
        catch (e) {
            myLog(e)
            return null
        }
    }

    /**
     * @description 返回文件类型
     * <br/>"DIR"、"FILE"、null
     * <br/>目标非文件或文件夹或不存在 => 返回null
     */
    const _getFileType = (...dir: string[]): 'DIR' | 'FILE' | null => {
        try {
            const _dir: string = path.resolve(...dir)
            if(fs.statSync(_dir).isDirectory()) return 'DIR'
            else if(fs.statSync(_dir).isFile()) return 'FILE'
            else return null
        }
        catch (e) {
            myLog('ERROR', e)
            return null
        }
    }
    // endregion
}

// export type FileTreeNode = FileTree.FileTreeNode
module.exports = {
    TreeClass: FileTree.FileTree
}
