import path from "path";
import {ipcRenderer} from "electron";

// region 全局ipc事件
/**
 * @description [F12] 打开控制台
 */
const sendIpcF12 = () => {
    ipcRenderer.send('F12', null)
}

/**
 * @description [LOG] 写入日志
 */
const sendIpcLOG = (args: { type: 'INFO' | 'WARNING' | 'ERROR', e: string }) => {
    ipcRenderer.send('LOG', args)
}

/**
 * @description [URL] 打开指定url
 */
const sendIpcUrl = (args: string) => {
    ipcRenderer.send('URL', args)
}
// endregion

// region 组件内ipc事件
/**
 * @description nav-bar 上的按钮: 最小、最大、关闭、打开github页面
 */
const sendIpcNav = (args: 'MIN' | 'MAX' | 'CLOSE') => {
    ipcRenderer.send('NAV', args)
}
// endregion

/**
 * @description 测试 TODO 删除
 */
const sendIpcTest = (args: { depth: number }) => {
    console.log(args)
    ipcRenderer.send('test', args)
}

export {
    // 全局
    sendIpcF12,
    sendIpcLOG,
    sendIpcUrl,

    // 组件
    sendIpcNav,

    // 测试 TODO 删除
    sendIpcTest
}