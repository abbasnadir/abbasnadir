import { useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../hooks'

type Spark = { id: number; dx: number; dy: number; hot: boolean; round: boolean }

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
    setTimeout(() => setCopied(false), 1600)
    if (reduced) return
    const burst = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.3
      const dist = 30 + Math.random() * 36
      return { id: Date.now() + i, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, hot: i % 3 === 0, round: i % 2 === 0 }
    })
    setSparks(burst)
    setTimeout(() => setSparks([]), 600)
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 font-sans">
      <a href={`mailto:${email}`} className="ui-link text-lg">
        {email}
      </a>
      {/* The minifier rewrites the transparent fill as #0000, which anti-slop reads as a filled card. */}
      <button
        type="button"
        onClick={copy}
        data-slop-allow="redundant-border"
        className="press relative cursor-pointer rounded border border-rule bg-transparent px-3 py-1 font-sans text-[0.9375rem] text-ink hover:border-accent active:border-accent-press active:text-accent-press disabled:cursor-not-allowed disabled:text-muted"
      >
        {copied ? 'Copied' : 'Copy address'}
        {sparks.map((s) => (
          <span
            key={s.id}
            className={`spark ${s.hot ? 'spark-hot' : ''} ${s.round ? 'spark-round' : ''}`}
            style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px` } as CSSProperties}
            aria-hidden="true"
          />
        ))}
      </button>
      <span className="sr-only" role="status">
        {copied ? 'Email address copied' : ''}
      </span>
    </span>
  )
}
