import { FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import RippleButton from './Button.js'

const Nav: React.FC = () => {
  return (
    <nav className={'flex items-center justify-between px-5 shadow-md  py-1 bg-zinc-800 h-12'}>
      <div className={'flex items-center gap-7'}>
        <Link to={'/'}>
          <h1 className="text-white text-[26px] font-semibold">KUIT</h1>
        </Link>
      </div>
      <div className={'flex items-center gap-7'}>
        <RippleButton
          className={
            '!bg-white  shadow-none hover:!bg-zinc-300 !rounded-full w-10 h-10 !px-0 py-0 flex items-center justify-center'
          }
          rippleColor={'black'}
        >
          <FaUser className={'text-zinc-700'} />
        </RippleButton>
      </div>
    </nav>
  )
}

export default Nav
