import { ReactNode } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'scale-down'
  | 'rotate-in'
  | 'flip-up'
  | 'flip-left'
  | 'blur-in'
  | 'slide-up-big'
  | 'slide-down-big'
  | 'zoom-in'
  | 'zoom-out'
  | 'bounce-in'
  | 'swing-in'
  | 'pulse-in'

interface ScrollRevealProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  threshold?: number
}

const animationClasses: Record<AnimationType, string> = {
  'fade-up': 'scroll-fade-up',
  'fade-down': 'scroll-fade-down',
  'fade-left': 'scroll-fade-left',
  'fade-right': 'scroll-fade-right',
  'scale-up': 'scroll-scale-up',
  'scale-down': 'scroll-scale-down',
  'rotate-in': 'scroll-rotate-in',
  'flip-up': 'scroll-flip-up',
  'flip-left': 'scroll-flip-left',
  'blur-in': 'scroll-blur-in',
  'slide-up-big': 'scroll-slide-up-big',
  'slide-down-big': 'scroll-slide-down-big',
  'zoom-in': 'scroll-zoom-in',
  'zoom-out': 'scroll-zoom-out',
  'bounce-in': 'scroll-bounce-in',
  'swing-in': 'scroll-swing-in',
  'pulse-in': 'scroll-pulse-in',
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold })

  return (
    <div
      ref={ref}
      className={`${animationClasses[animation]} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
