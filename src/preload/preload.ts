import { contextBridge, ipcRenderer } from 'electron'

interface IpcRenderer {
  invoke: (channel: string, data?: unknown) => Promise<unknown>
  on: (
    channel: string,
    callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
  ) => void
}

interface ElectronAPI {
  ipcRenderer: IpcRenderer
}

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, data?: unknown) => ipcRenderer.invoke(channel, data),
    on: (
      channel: string,
      callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ) => ipcRenderer.on(channel, callback)
  }
} as ElectronAPI)
