import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, data?: unknown) => ipcRenderer.invoke(channel, data)
  }
})
