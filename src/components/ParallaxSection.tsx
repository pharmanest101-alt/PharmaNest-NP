import { ReactNode } from 'react'
import { useElementScrollProgress } from '../hooks/useElementScrollProgress'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
}

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
  direction = 'up',
}: ParallaxSectionProps) {
  const { ref, progress } = useElementScrollProgress()
  const offset = (progress - 0.5) * speed * 200
  const y = direction === 'up' ? -offset : offset

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          transform: `translateY(${y}px)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
