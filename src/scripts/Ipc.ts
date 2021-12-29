import path from "path";
import {ipcRenderer} from "electron";

/**
 * @description F12打开控制台
 */
const sendIpcF12 = () => {
    ipcRenderer.send('F12', null)
}

/**
 * @description 写入日志
 */
const sendIpcLOG = (args: { type: 'INFO' | 'WARNING' | 'ERROR', e: string }) => {
    ipcRenderer.send('LOG', args)
}

/**
 * @description nav-bar 上的 最小、最大、关闭 按钮
 */
const sendIpcNav = (args: 'MIN' | 'MAX' | 'CLOSE') => {
    ipcRenderer.send('NAV', args)
}

/**
 * @description 测试 TODO 删除
 */
const sendIpcTest = (args: { depth: number }) => {
    console.log(args)
    ipcRenderer.send('test', args)
}

export {
    sendIpcF12,
    sendIpcNav,
    sendIpcLOG,
    sendIpcTest
}