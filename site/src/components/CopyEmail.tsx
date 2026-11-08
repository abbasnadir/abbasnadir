import { useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../hooks'

type Spark = { id: number; dx: number; dy: number; hot: boolean }

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const [sparks, setSparks] = useState<Spark[]>([])
  const reduced = useReducedMotion()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
    if (reduced) return
    const burst = Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.3
      const dist = 36 + Math.random() * 40
      return { id: Date.now() + i, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, hot: i % 3 === 0 }
    })
    setSparks(burst)
    setTimeout(() => setSparks([]), 700)
  }

  return (
    <span className="copy-email">
      <a href={`mailto:${email}`} className="email-link">
        {email}
      </a>
      {/* The minifier rewrites the transparent fill as #0000, which anti-slop reads as a filled card. */}
      <button type="button" className="copy-btn" onClick={copy} data-slop-allow="redundant-border">
        {copied ? 'Copied' : 'Copy address'}
        {sparks.map((s) => (
          <span
            key={s.id}
            className={s.hot ? 'spark spark-hot' : 'spark'}
            style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px` } as CSSProperties}
            aria-hidden="true"
          />
        ))}
      </button>
      <span className="visually-hidden" role="status">
        {copied ? 'Email address copied' : ''}
      </span>
    </span>
  )
}
