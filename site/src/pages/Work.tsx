import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router'
import { DiagramGlyph } from '../components/FlowDiagram'
import { Container, LinkRow, PageHeader, Section, UiLink } from '../components/ui'
import { otherProjects, projects, tags, type Tag } from '../content'

type Filter = Tag | 'All'

export function Work() {
  const [filter, setFilter] = useState<Filter>('All')
  const match = (t: Tag[]) => filter === 'All' || t.includes(filter)
  const cases = projects.filter((p) => match(p.tags))
  const others = otherProjects.filter((p) => match(p.tags))
  const count = (t: Filter) =>
    t === 'All' ? projects.length + otherProjects.length : [...projects, ...otherProjects].filter((p) => p.tags.includes(t)).length

  // Wrap the state change in a view transition so kept items slide to their new
  // positions and removed ones fade, instead of the list jumping.
  const choose = (next: Filter) => {
    if (next === filter) return
    if (!document.startViewTransition) return setFilter(next)
    document.startViewTransition(() => flushSync(() => setFilter(next)))
  }

  return (
    <>
      <title>Work, Abbas Nadir</title>
      <Container wide>
        <PageHeader
          title="Work"
          lede="Three projects written up in depth, plus smaller things I’ve built."
        />

        <div role="group" aria-label="Filter projects by area" className="flex flex-wrap gap-x-6 gap-y-3 font-sans text-base">
          {(['All', ...tags] as Filter[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={filter === t}
              onClick={() => choose(t)}
              className={`press relative cursor-pointer bg-transparent p-0 ${filter === t ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              {t} <span className="text-muted tabular-nums">{count(t)}</span>
              {filter === t && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 -bottom-1.5 left-0 h-0.5 bg-accent text-accent-ink"
                  style={{ viewTransitionName: 'filter-thread' }}
                />
              )}
            </button>
          ))}
        </div>

        <Section id="case-studies" title="Projects with case studies">
          {cases.length === 0 && <p className="mt-4 text-muted">No case study is tagged {filter} yet.</p>}
          <ul>
            {cases.map((p) => (
              <li
                key={p.slug}
                className="work-item grid gap-x-10 gap-y-4 border-b border-rule py-8 last:border-b-0 md:grid-cols-[minmax(0,1fr)_18rem] md:items-center"
                style={{ viewTransitionName: `work-${p.slug}` }}
              >
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-2xl tracking-tight">
                      <Link to={`/work/${p.slug}`} viewTransition className="ui-link text-accent">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="font-sans text-[0.9375rem] text-muted tabular-nums">{p.when}</p>
                  </div>
                  <p className="mt-2">{p.summary}</p>
                  <p className="mt-1 text-muted">{p.role}</p>
                  <p className="mt-1 text-muted">{p.stack.join(', ')}</p>
                  <LinkRow>
                    <UiLink to={`/work/${p.slug}`}>Read the case study</UiLink>
                    <UiLink href={p.repo}>Source</UiLink>
                    {p.live && <UiLink href={p.live}>Play it</UiLink>}
                  </LinkRow>
                </div>
                <Link to={`/work/${p.slug}`} viewTransition tabIndex={-1} aria-hidden="true" className="block rounded-md bg-surface p-4">
                  <DiagramGlyph diagram={p.diagram} />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="more" title="More projects">
          {others.length === 0 && <p className="mt-4 text-muted">Nothing else is tagged {filter}.</p>}
          <ul className="grid gap-x-10 md:grid-cols-2">
            {others.map((p) => (
              <li
                key={p.url}
                className="work-item border-b border-rule py-6"
                style={{ viewTransitionName: `work-${p.url.split('/').pop()}` }}
              >
                <h3 className="text-lg">
                  <a href={p.url} className="ui-link text-accent">
                    {p.name}
                  </a>
                </h3>
                <p className="mt-1">{p.what}</p>
                <p className="mt-1 text-muted">{p.stack.join(', ')}</p>
                {p.live && (
                  <LinkRow>
                    <UiLink href={p.live}>Try it</UiLink>
                  </LinkRow>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </>
  )
}
