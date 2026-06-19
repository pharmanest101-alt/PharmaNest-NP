import { useRef, useState, ReactNode } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  glareEnabled?: boolean
}

export default function TiltCard({
  children,
  className = '',
  tiltAmount = 15,
  glareEnabled = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)')
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * tiltAmount
    const rotateY = (x - 0.5) * tiltAmount

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`)
    setGlarePosition({ x: x * 100, y: y * 100, opacity: 0.15 })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)')
    setGlarePosition({ x: 50, y: 50, opacity: 0 })
  }

  return (
    <div
      ref={ref}
      className={`apple-tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {children}
      {glareEnabled && (
        <div
          className="apple-tilt-glare"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}) 0%, transparent 60%)`,
          }}
        />
      )}
    </div>
  )
}
