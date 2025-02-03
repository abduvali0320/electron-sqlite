import { useEffect, useState } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
declare global {
  interface Window {
    electron: { ipcRenderer: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> } }
  }
}

const { ipcRenderer } = window.electron
interface SavedData {
  id: string
  text: string
  filePath?: string
}
import React from 'react'

export default function App(): React.ReactElement {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [id, setID] = useState<null | string>(null)
  const [savedData, setSavedData] = useState<SavedData[]>([])
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files ? event.target.files[0] : null
    setFile(file)
  }
  const handleSave = async (): Promise<void> => {
    if (!id) {
      const formData: { text: string; filePath?: string; id: string } = { text, id: '' }
      if (file) {
        formData.filePath = file.path
      }
      formData.id = Date.now().toString()
      const response = (await ipcRenderer.invoke('save-data', formData)) as { message: string }
      alert(response.message)
    } else {
      const formData: { text: string; filePath?: string; id: string } = { text, id }
      if (file) {
        formData.filePath = file.path
      }
      const response = (await ipcRenderer.invoke('update-data', formData)) as { message: string }
      alert(response.message)
    }
    clearInput()
    loadData()
  }
  const clearInput = (): void => {
    setText('')
    setFile(null)
    setID(null)
  }

  const deleteItem = async (id: string): Promise<void> => {
    const isConfirmed = window.confirm("Siz haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz?")
    if (!isConfirmed) return
    try {
      const response = (await window.electron.ipcRenderer.invoke('delete-data', id)) as {
        success: boolean
        message: string
      }
      console.log(response)
      if (response?.success) {
        setSavedData(savedData.filter((item) => item.id !== id))
        alert('Ma`lumot o`chirildi!')
      } else {
        alert(response.message)
      }
    } catch (error) {
      console.error('Xatolik yuz berdi:', error)
      alert('Xatolik yuz berdi!')
    }
  }

  const editItem = async (id: string): Promise<void> => {
    const itemToEdit = savedData.find((item) => item.id === id)
    if (!itemToEdit) return
    setText(itemToEdit?.text)
    setID(itemToEdit?.id)
    setFile(
      itemToEdit?.filePath
        ? new File([itemToEdit?.filePath], itemToEdit?.filePath, {
            type: 'application/octet-stream'
          })
        : null
    )
  }

  const loadData = async (): Promise<void> => {
    const data = (await ipcRenderer.invoke('get-data')) as unknown[]
    setSavedData(data as SavedData[])
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <div className="mx-auto p-4">
      <div className="flex space-x-4">
        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
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
                className="w-full sm:w-auto px-4 bg-blue-600 text-white py-1 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {id ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Saqlangan Ma`lumotlar</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 border-b">ID</th>
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
                  <td className="px-6 py-1 text-sm text-gray-700">{item.id}</td>
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
                  <td>
                    <button
                      className="text-sm bg-green-400 p-2 text-gray-600 hover:text-gray-900 rounded-md"
                      title="Edit"
                      onClick={() => editItem(item.id)}
                    >
                      <FiEdit3 className="size-5 text-white" />
                    </button>
                    <button
                      className="bg-red-400 hover:text-gray-900 p-2 rounded-md ml-2"
                      title="Delete"
                      onClick={() => deleteItem(item.id)}
                    >
                      <MdDeleteOutline className="size-5 text-white" />
                    </button>
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
