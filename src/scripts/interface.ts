/**
 * @description 解析后的文件树
 */
interface FileTreeNode {
    uuid: string  // 节点的id - 可用作表格的row-key
    type: 'DIR' | 'FILE'  // 目录/文件
    root: string  // 根目录/磁盘名
    base: string  // 文件名+扩展名
    name: string  // 文件名
    ext: string  // 扩展名
    dir: string  // 绝对路径
    ifDeep: boolean  // 是否获取了子目录信息
    children?: FileTreeNode[]  // 子目录
}

export {
    FileTreeNode
}