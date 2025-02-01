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
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL('http://localhost:5173')
})

const userDataPath = app.getPath('userData')
const dataFile = path.join(userDataPath, 'data.json')

ipcMain.handle('get-data', async () => {
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
