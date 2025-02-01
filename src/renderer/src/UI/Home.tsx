import { useEffect, useState } from 'react'
import RippleButton from '../components/Button'
import axios from 'axios'
function Home(): JSX.Element {
  const [inputValue, setInputValue] = useState({
    name: '',
    surename: '',
    patronymic: '',
    image: null as File | null
  })
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    console.log('image', inputValue.image)
    console.log('input value', inputValue)
  }
  const getInputValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value })
  }
  const getFileImg = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue({ ...inputValue, image: e.target.files![0] })
  }
  const clickHandle = (): void => {
    console.log('button clicked')
  }

  const testGetData = async (): Promise<void> => {
    try {
      const res = await axios('https://', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    testGetData()
  }, [])

  return (
    <div className={'w-full'}>
      <h1>Talabarlarni ro`yxatga olish</h1>
      <form onSubmit={handleAddStudent} className="px-4">
        <div className="grid grid-cols-3 gap-4 items-center mb-4">
          <div>
            <input
              type="text"
              placeholder="Ism"
              name="name"
              onChange={getInputValue}
              value={inputValue?.name}
              className="input-form"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Familya"
              name="surename"
              onChange={getInputValue}
              value={inputValue?.surename}
              className="input-form"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Otasining ismi"
              name="patronymic"
              onChange={getInputValue}
              value={inputValue?.patronymic}
              className="input-form"
            />
          </div>
          <div>
            <input type="file" placeholder={'image'} onChange={getFileImg} className="input-form" />
          </div>
        </div>
        <div className="text-end">
          <RippleButton className={'bg-blue-400 mt-2'} onClick={() => clickHandle()}>
            Saqlash
          </RippleButton>
        </div>
      </form>
    </div>
  )
}

export default Home
