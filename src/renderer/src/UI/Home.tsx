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
    <div className="mx-auto p-6">
      <div className="flex space-x-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ma`lumot Kiriting</h2>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Matn kiriting..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <div>
              <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
                Faylni tanlang:
              </label>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Saqlangan Ma`lumotlar</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 border-b">
                  Matn
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 border-b">
                  Rasm
                </th>
              </tr>
            </thead>
            <tbody>
              {savedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b">
                  <td className="px-6 py-1 text-sm text-gray-700">{item.text}</td>
                  <td className="px-6 py-1">
                    {item.filePath && (
                      <img
                        src={item.filePath}
                        alt="saved"
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
