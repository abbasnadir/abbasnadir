import type { ReactNode } from 'react'
import { Link } from 'react-router'

// Shared building blocks. Every page sits in the same centred 66rem frame so the wordmark,
// headings and text share one left edge on every page. Reading content is capped at 44rem
// inside that frame and stays left-aligned; `wide` lets the work index use the full frame.

export function Container({ wide = false, className = '', children }: { wide?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`mx-auto w-full max-w-wide px-5 sm:px-8 ${className}`}>
      {wide ? children : <div className="max-w-page">{children}</div>}
    </div>
  )
}

export function PageHeader({ title, lede }: { title: string; lede?: ReactNode }) {
  return (
    <header className="pt-12 pb-10 sm:pt-16">
      <h1 className="page-title font-sans text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      {lede && <p className="mt-4 max-w-[36rem] text-xl text-muted">{lede}</p>}
    </header>
  )
}

export function Section({ id, title, children, className = '' }: { id: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`mt-14 scroll-mt-8 ${className}`}>
      <h2 id={`${id}-title`} className="border-b border-rule pb-2 text-2xl tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function EntryHead({ title, when }: { title: ReactNode; when?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1">
      <h3 className="min-w-0 text-lg [overflow-wrap:break-word]">{title}</h3>
      {when && <p className="font-sans text-[0.9375rem] whitespace-nowrap text-muted tabular-nums">{when}</p>}
    </div>
  )
}

// A row of standalone links: no underline at rest, a thread draws in on hover.
export function LinkRow({ children }: { children: ReactNode }) {
  return <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-sans text-base">{children}</p>
}

export function UiLink({ to, href, children }: { to?: string; href?: string; children: ReactNode }) {
  if (to)
    return (
      <Link to={to} viewTransition className="ui-link">
        {children}
      </Link>
    )
  return (
    <a href={href} className="ui-link">
      {children}
    </a>
  )
}
