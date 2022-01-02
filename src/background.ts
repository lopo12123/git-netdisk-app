'use strict'

import {app, protocol, BrowserWindow, ipcMain, shell} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'

const myLog = require('./scripts/Logger').myLog
const getDiskInfo = require('./scripts/DiskInfo').getDiskInfo

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

// global win
let win: BrowserWindow | null = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    // region [DISK] 获取盘符
    ipcMain.on('DISK', (ev, args: string) => {
        ev.reply('DISK', { uuid: args, disks: getDiskInfo() })
    })
    // endregion

    // region [F12] F12打开控制台
    ipcMain.on('F12', (e, args: null) => {
        if(!win) return

        if(!win.webContents.isDevToolsOpened()) {
            win.webContents.openDevTools()
        }
    })
    // endregion

    // region [LOG] 写入日志
    ipcMain.on('LOG', (e, args: { type: 'INFO' | 'WARNING' | 'ERROR', e: string }) => {
        myLog(args.type, args.e)
    })
    // endregion

    // region [URL] 打开指定网站
    ipcMain.on('URL', (e, url: string) => {
        shell.openExternal(url)
    })
    // endregion

    // region [NAV] 按钮: 最小、最大、关闭
    ipcMain.on('NAV', (e, args: 'MAX' | 'MIN' | 'CLOSE') => {
        if(!win) return

        switch(args) {
            case "MIN":
                win.minimize()
                break
            case "MAX":
                const ifMax = win.isMaximized()
                ifMax
                    ? win.unmaximize()
                    : win.maximize()
                break
            case "CLOSE":
                // 设置frame=false时, win.close()方法无效
                win = null
                app.exit()
                break
        }
    })
    // endregion

    // region [HOME] 点击选框选择文件/拖拽选择文件夹 - 解析文件树并返回
    ipcMain.on('HOME', (ev, args: {uuid: string, path: string | null}) => {
        console.log(args.uuid, args.path)
        setTimeout(() => {
            ev.reply('HOME', {uuid: args.uuid, tree: {id: 'root', children: []}})
        }, 2_000)
    })
    // endregion

    // region create the app
    await createWindow()
    // endregion
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

/**
 * @description 使dev模式下可以强制退出
 */
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        backgroundColor: '#fcfcfc',
        webPreferences: {
            // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    })

    // 在dev/prod模式下load不同的url
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        await win.loadURL('app://./index.html')
    }
}
