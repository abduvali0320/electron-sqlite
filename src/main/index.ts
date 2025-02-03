import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
let mainWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    mainWindow.loadURL('http://localhost:5173')
  }
})

const userDataPath = app.getPath('userData')
const dataFile = path.join(userDataPath, 'data.json')

ipcMain.handle('get-data', async () => {
  console.log('userDataPath', userDataPath)

  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  }
  return []
})

ipcMain.handle('save-data', async (_, formData: { filePath?: string }) => {
  try {
    let savedData: { filePath?: string }[] = []
    if (fs.existsSync(dataFile)) {
      savedData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    }
    if (formData.filePath) {
      const fileBuffer = fs.readFileSync(formData.filePath)
      const base64Image = fileBuffer.toString('base64')
      formData.filePath = `data:image/png;base64,${base64Image}`
    }

    savedData.push(formData)
    fs.writeFileSync(dataFile, JSON.stringify(savedData, null, 2), 'utf-8')

    return { success: true, message: "Ma'lumot saqlandi!" }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('delete-data', async (_, id: string) => {
  console.log('delete-data handler chaqirildi, id =', id)
  try {
    let savedData = []
    if (fs.existsSync(dataFile)) {
      savedData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    }
    savedData = savedData.filter((item: { id: string }) => item.id !== id)
    fs.writeFileSync(dataFile, JSON.stringify(savedData, null, 2), 'utf-8')
    return { success: true, message: "Ma'lumot o'chirildi!" }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle(
  'update-data',
  async (_, updatedItem: { id: string; text: string; filePath?: string }) => {
    try {
      let savedData = []
      if (fs.existsSync(dataFile)) {
        savedData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
      }
      const newData = savedData.map((item: { id: string; text: string; filePath?: string }) => {
        if (item.id === updatedItem.id) {
          return {
            ...item,
            text: updatedItem.text,
            filePath: updatedItem.filePath || item.filePath
          }
        }
        return item
      })

      fs.writeFileSync(dataFile, JSON.stringify(newData, null, 2), 'utf-8')
      return { success: true, message: "Ma'lumot tahrirlandi!" }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }
)
