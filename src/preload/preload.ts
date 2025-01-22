import { contextBridge } from 'electron'
import { addItem, getItems } from '../main/dbmgr'

contextBridge.exposeInMainWorld('api', {
  addItem: (name: string, image: Buffer) => addItem(name, image),
  getItems: () => getItems()
})
