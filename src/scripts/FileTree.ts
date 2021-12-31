/// background
/// 其中所有的私有方法都为同步方法(sync), 出错或不满足返回条件则返回值为null
namespace FileTree {
    const fs = require("fs");
    const path = require("path");
    const uuid = require("uuid").v4;
    const myLog = require("../scripts/Logger").myLog;

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
        tree: FileTreeNode | null = null

        /**
         * @description 传入路径, 以此为根构建文件树类
         */
        constructor(dir: string[], depth: number = 1) {
            this.tree = getDirTree(dir, depth)
        }

        /**
         * @description 传入当前树的某个节点的uuid, 尝试展开1层其子树
         * @deprecated
         */
        expand(nodeId: string) {
            // TODO 发布npm包后引用
            // 如果树中不存在此nodeId或nodeId对应节点类型为'FILE' => 返回false
            // 展开子树: 成功 => true; 失败 => false
        }

        /**
         * @description 重新构建文件树(刷新)
         */
        rebuild(dir: string[], depth: number = 1) {
            this.tree = getDirTree(dir, depth)
        }

        /**
         * @description 清空树(触发gc)
         */
        clear() {
            this.tree = null
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
