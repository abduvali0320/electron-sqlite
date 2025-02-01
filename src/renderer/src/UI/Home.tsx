import { useEffect, useState } from 'react'
declare global {
  interface Window {
    electron: { ipcRenderer: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> } }
  }
}

const { ipcRenderer } = window.electron
interface SavedData {
  text: string
  filePath?: string
}
import React from 'react'

export default function App(): React.ReactElement {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [savedData, setSavedData] = useState<SavedData[]>([])
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files ? event.target.files[0] : null
    setFile(file)
  }
  const handleSave = async (): Promise<void> => {
    const formData: { text: string; filePath?: string } = { text }

    if (file) {
      formData.filePath = file.path
    }
    const response = (await ipcRenderer.invoke('save-data', formData)) as { message: string }
    alert(response.message)
    loadData()
  }

  const loadData = async (): Promise<void> => {
    const data = (await ipcRenderer.invoke('get-data')) as unknown[]

    setSavedData(data as SavedData[])
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <div>
      <input
        type="text"
        placeholder="Matn kiriting..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <label htmlFor="fileInput">Choose a file:</label>
      <input type="file" id="fileInput" onChange={handleFileChange} />
      <button onClick={handleSave}>Saqlash</button>
      <button onClick={loadData}>Yuklash</button>
      <ul>
        {savedData.map((item, index) => {
          return (
            <li key={index}>
              {item.text} <br />
              <img src={item.filePath} alt="saved" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
