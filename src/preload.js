import { ipcRenderer, contextBridge } from 'electron'
contextBridge.exposeInMainWorld('frame', {
    closeApp: () => ipcRenderer.send('closeApp'),
    sizeApp: () => ipcRenderer.send('sizeApp'),
    reduceApp: () => ipcRenderer.send('reduceApp')
})

