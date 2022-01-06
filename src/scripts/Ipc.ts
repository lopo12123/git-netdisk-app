/// foreground
/// 某些ipc需要回调, 采用promise方式. 传参时需要添加uuid作为消息往返凭证
import path from "path";
import {ipcRenderer} from "electron";
import {DiskInfo, FileTreeNode} from "@/scripts/interface";

// region 全局ipc事件
/**
 * @description [DISK] 获取系统盘符
 */
const sendIpcDisk = (uuid: string): Promise<DiskInfo[] | null> => {
    return new Promise((resolve, reject) => {
        let timeoutTimer = true
        ipcRenderer.send('DISK', uuid)
        ipcRenderer.once('DISK', (ev, args: { uuid: string, disks: DiskInfo[] | null }) => {
            timeoutTimer = false
            if(args.uuid === uuid) {
                resolve(args.disks)
            }
            else {
                reject('TIMEOUT')
            }
        })
        setTimeout(() => {  // 设置最长等待时间, 超时则不作等待直接返回错误信息
            if(timeoutTimer) {
                reject('TIMEOUT')
            }
        }, 5_000)
    })
}

/**
 * @description [F12] 打开控制台
 */
const sendIpcF12 = () => {
    ipcRenderer.send('F12', null)
}

/**
 * @description [LOG] 写入日志
 */
const sendIpcLog = (args: { type: 'INFO' | 'WARNING' | 'ERROR', e: string }) => {
    ipcRenderer.send('LOG', args)
}

/**
 * @description [URL] 打开指定url
 */
const sendIpcUrl = (url: string) => {
    ipcRenderer.send('URL', url)
}
// endregion

// region 组件内ipc事件
/**
 * @description [NAV] [AppNavBar.vue] 按钮: 最小、最大、关闭
 */
const sendIpcNav = (args: 'MIN' | 'MAX' | 'CLOSE') => {
    ipcRenderer.send('NAV', args)
}

/**
 * @description [Tree] 初始化文件树或扩展文件树 - 返回最新的文件树
 * @param type 初始化(INIT) / 扩展(EXPAND)
 * @param uuid 此次通信的uuid
 * @param pathOrNodeId 参数(初始化: 传path; 扩展: 传nodeId)
 */
const sendIpcTree = (type: 'INIT' | 'EXPAND', uuid: string, pathOrNodeId: string): Promise<{ result: boolean, reason: string, tree: FileTreeNode, uuid: string }> => {
    return new Promise((resolve, reject) => {
        let timeoutTimer = true
        ipcRenderer.send('Tree', { type, uuid, pathOrNodeId })
        ipcRenderer.once('Tree', (ev, args: { result: boolean, reason: string, tree: FileTreeNode, uuid: string }) => {
            timeoutTimer = false
            if(args.uuid === uuid) {
                resolve(args)
            }
            else {
                reject('TIMEOUT')
            }
        })
        setTimeout(() => {
            if(timeoutTimer) {
                reject('TIMEOUT')
            }
        }, 5_000)
    })
}

/**
 * @description [Explorer] 在资源管理器中打开目录
 * @param uuid 通信uuid
 * @param dir 目标目录
 */
const sendIpcExplorer = ({uuid, dir}: {uuid: string, dir: string}) => {
    ipcRenderer.send('Explorer', {uuid, dir})
}
// endregion

export {
    // 全局
    sendIpcDisk,
    sendIpcF12,
    sendIpcLog,
    sendIpcUrl,

    // 组件
    sendIpcNav,
    sendIpcTree,
    sendIpcExplorer,
}
