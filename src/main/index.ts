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

  mainWindow.loadURL('http://localhost:5173')
})

ipcMain.handle('get-data', async () => {
  const dataFile = path.join(app.getPath('userData'), 'data.json')
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  }
  return []
})

ipcMain.handle('save-data', async (_, formData: { filePath?: string }) => {
  const userDataPath = app.getPath('userData')
  const dataFile = path.join(userDataPath, 'data.json')

  try {
    let savedData: { filePath?: string }[] = []
    if (fs.existsSync(dataFile)) {
      savedData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    }

    if (formData.filePath) {
      const ext = path.extname(formData.filePath)
      const newFileName = `file-${Date.now()}${ext}`
      const newFilePath = path.join(userDataPath, newFileName)

      // Faylni nusxalash
      fs.copyFileSync(formData.filePath, newFilePath)
      formData.filePath = newFilePath
    }

    savedData.push(formData)

    fs.writeFileSync(dataFile, JSON.stringify(savedData, null, 2), 'utf-8')

    return { success: true, message: "Ma'lumot saqlandi!" }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})
