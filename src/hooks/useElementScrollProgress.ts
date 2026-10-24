import { useEffect, useRef, useState } from 'react'

export function useElementScrollProgress(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handler = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      const start = windowHeight
      const end = -elementHeight
      const current = elementTop

      const rawProgress = 1 - (current - end) / (start - end)
      setProgress(Math.max(0, Math.min(1, rawProgress)))
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])

  return { ref, progress }
}
