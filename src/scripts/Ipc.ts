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

/**
 * @description [Tree] 传入路径 - 解析文件树并返回
 */
const sendIpcTree = ({uuid, path, nodeId}: { uuid: string, path: string, nodeId: string }): Promise<{uuid: string, tree: FileTreeNode, result: boolean}> => {
    return new Promise((resolve, reject) => {
        let timeoutTimer = true
        ipcRenderer.send('Tree', {uuid, path})
        ipcRenderer.once('Tree', (ev, args: {uuid: string, tree: FileTreeNode, result: boolean}) => {
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
// endregion

// region 组件内ipc事件
/**
 * @description [NAV] [AppNavBar.vue] 按钮: 最小、最大、关闭
 */
const sendIpcNav = (args: 'MIN' | 'MAX' | 'CLOSE') => {
    ipcRenderer.send('NAV', args)
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
}
