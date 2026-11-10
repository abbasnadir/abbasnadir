import type { Evidence as EvidenceData } from '../content'

// Real material from a project: an excerpt of its code with a link to the file, or a screenshot.
// Code is set in the sans like everything else (the site uses no monospace); whitespace is kept.
// `priority` marks the first image on a page, which is likely the largest paint, so it loads eagerly.
export function Evidence({ evidence, compact = false, priority = false }: { evidence: EvidenceData; compact?: boolean; priority?: boolean }) {
  if (evidence.kind === 'image')
    return (
      <figure className="m-0">
        <img
          src={evidence.src}
          alt={evidence.alt}
          width={evidence.width}
          height={evidence.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="block h-auto w-full rounded-md border border-rule"
        />
        <figcaption className="mt-2 font-sans text-[0.9375rem] text-muted">{evidence.title}</figcaption>
      </figure>
    )

  return (
    <figure className="m-0">
      <div className="code-scroll rounded-md bg-surface">
        <pre className={`code m-0 px-4 py-3 ${compact ? 'text-[0.8125rem]' : 'text-[0.9375rem]'}`}>
          <code>{evidence.code}</code>
        </pre>
      </div>
      <figcaption className="mt-2 font-sans text-[0.9375rem] text-muted">
        {evidence.title}, from{' '}
        <a href={evidence.url} className="ui-link text-accent">
          {evidence.source}
        </a>
      </figcaption>
    </figure>
  )
}
