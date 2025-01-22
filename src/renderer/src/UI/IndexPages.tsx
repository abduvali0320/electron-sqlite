import { Route, Routes } from 'react-router-dom'
import Home from './Home.js'
import About from './About.js'

function IndexPages(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={'/about'} element={<About />} />
    </Routes>
  )
}

export default IndexPages
