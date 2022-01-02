/**
 * @description wmic获取的磁盘信息
 */
interface DiskInfo {
    caption: string  // 盘符
    freeSize: number  // 剩余空间 bit
    totalSize: number  // 总空间 bit
}

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

export {
    DiskInfo,
    FileTreeNode
}
