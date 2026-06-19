import { ReactNode } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface TextRevealProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function TextReveal({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  tag: Tag = 'h2',
}: TextRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const words = text.split(' ')

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`apple-text-reveal-word ${isVisible ? 'is-visible' : ''} ${wordClassName}`}
          style={{ transitionDelay: `${delay + i * 60}ms` }}
        >
          <span className="apple-text-reveal-inner">{word}</span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  )
}
