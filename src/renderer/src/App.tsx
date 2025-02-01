import { useState } from 'react'
import '../assets/index.css'
import IndexPages from './UI/IndexPages'
import Nav from './components/Nav'
import Sitebar from './components/Sitebar'
function App(): JSX.Element {
  const [isSitebar] = useState(false)
  return (
    <div>
      <Nav />
      <div className={'flex items-start z-0'}>
        <Sitebar />
        <div
          className={`max-h-[calc(100vh - 48px)] duration-200 ${isSitebar ? 'w-[calc(100%-220px)]' : 'w-[100%]'}`}
        >
          <IndexPages />
        </div>
      </div>
    </div>
  )
}

export default App
