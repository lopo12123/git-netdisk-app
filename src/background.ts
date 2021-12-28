'use strict'

import {app, protocol, BrowserWindow, ipcMain} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'

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
    await createWindow()

    // nav-bar 上的 最小、最大、关闭 按钮
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
        width: 400,
        height: 300,
        minWidth: 400,
        minHeight: 300,
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
