import { useRef, useState, ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  href?: string
  onClick?: () => void
}

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

export default function MagneticButton({
  children,
  className = '',
  strength = 0.25,
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [transform, setTransform] = useState('translate(0px, 0px)')
  const [tracking, setTracking] = useState(false)
  const canHover = useRef(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    canHover.current =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!canHover.current) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setTracking(true)
    setTransform(`translate(${(x * strength).toFixed(2)}px, ${(y * strength).toFixed(2)}px)`)
  }

  const handlePointerLeave = () => {
    setTracking(false)
    setTransform('translate(0px, 0px)')
  }

  const style: React.CSSProperties = {
    transform,
    transition: `transform ${tracking ? 200 : 400}ms ${EASE}`,
  }

  const handlers = {
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onBlur: handlePointerLeave,
  }

  const isInternal = !!href && !/^[a-z]+:/i.test(href) && !href.startsWith('//')

  if (isInternal) {
    return (
      <Link
        to={href!}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={className}
        style={style}
        {...handlers}
      >
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={className}
        style={style}
        {...handlers}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      ref={ref as React.Ref<HTMLButtonElement>}
      className={className}
      style={style}
      onClick={onClick}
      {...handlers}
    >
      {children}
    </button>
  )
}
