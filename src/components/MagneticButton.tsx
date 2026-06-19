import { useRef, useState, ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  as?: 'button' | 'a'
  href?: string
  onClick?: () => void
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  as = 'button',
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  const [transform, setTransform] = useState('translate(0, 0) scale(1)')

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setTransform(`translate(${x * strength}px, ${y * strength}px) scale(1.05)`)
  }

  const handleMouseLeave = () => {
    setTransform('translate(0, 0) scale(1)')
  }

  const Tag = as
  const props = as === 'a' ? { href } : { onClick }

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
      {...props}
    >
      {children}
    </Tag>
  )
}
