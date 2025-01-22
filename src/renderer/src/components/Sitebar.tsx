// import { useAppSelector } from '../../feuters/hook.ts'
// import { RootState } from '../../Store.tsx'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Sitebar: React.FC = () => {
  // const { isSitebar } = useAppSelector((state: RootState) => state.changeState)
  const [isSitebar] = useState(true)
  return (
    <div
      className={`bg-zinc-800 shadow-sm h-[calc(100vh-48px)] origin-left duration-200  h z-0  transition-[width, scale, overflow]  ${isSitebar ? 'w-[220px] p-2' : 'w-0 overflow-hidden scale-x-0'} `}
    >
      <ul className="flex flex-col w-full gap-y-2">
        <li className="hover:bg-zinc-700 rounded-md ">
          <NavLink to="/" className="text-white block p-2 rounded-md duration-150">
            Home
          </NavLink>
        </li>
        <li className="hover:bg-zinc-700 rounded-md">
          <NavLink to="/about" className="text-white block p-2 duration-150 rounded-md">
            About
          </NavLink>
        </li>
        <li className="hover:bg-zinc-700 rounded-md">
          <NavLink to="/services" className="text-white block p-2 duration-150 rounded-md">
            Services
          </NavLink>
        </li>
        <li className="hover:bg-zinc-700 rounded-md">
          <NavLink to="/contact" className="text-white block p-2 duration-150 rounded-md">
            Contact
          </NavLink>
        </li>
        <li className="hover:bg-zinc-700 rounded-md">
          <NavLink to="/login" className="text-white block p-2 duration-150 rounded-md">
            Login
          </NavLink>
        </li>
        <li className="hover:bg-zinc-700 rounded-md">
          <NavLink to="/register" className="text-white block p-2 duration-150 rounded-md">
            Register
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Sitebar
