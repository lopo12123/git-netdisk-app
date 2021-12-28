import path from "path";
import {ipcRenderer} from "electron";

const sendIpc = (type: 'MIN' | 'MAX' | 'CLOSE') => {
    console.log(type)
    ipcRenderer.send('NAV', type)
}

export {
    sendIpc
}