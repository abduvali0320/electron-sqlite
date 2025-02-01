import { ButtonTypes } from '@renderer/types/interfaces'
import { MouseEvent } from 'react'
interface RippleButtonProps extends ButtonTypes {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}
const RippleButton = ({
  children,
  className,
  rippleColor = 'rgba(255, 255, 255, 0.8)',
  onClick
}: RippleButtonProps): JSX.Element => {
  const createRipple = (event: MouseEvent<HTMLButtonElement>): void => {
    const button = event.currentTarget
    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2
    circle.style.backgroundColor = rippleColor
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`
    circle.classList.add('ripple')

    const ripple = button.getElementsByClassName('ripple')[0]
    if (ripple) {
      ripple.remove()
    }

    button.appendChild(circle)
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (onClick) {
      onClick(event)
    }
    createRipple(event)
  }

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden bg-blue-600 text-white font-medium py-1 px-5 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  )
}

export default RippleButton
