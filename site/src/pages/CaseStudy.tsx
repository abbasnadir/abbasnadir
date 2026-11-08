import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { FlowDiagram } from '../components/FlowDiagram'
import { Container, LinkRow, PageHeader, UiLink } from '../components/ui'
import { projects } from '../content'
import { NotFound } from './NotFound'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-3 text-[1.375rem] tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

export function CaseStudy() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return <NotFound />
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]

  return (
    <Container>
      <article>
        <title>{`${p.name}, a case study by Abbas Nadir`}</title>
        <meta name="description" content={p.summary} />

        <PageHeader title={p.name} lede={p.summary} />

        <dl className="-mt-4 mb-10 grid gap-2">
          {[
            ['Role', p.role],
            ['When', p.when],
            ['Stack', p.stack.join(', ')],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-x-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
              <dt className="font-sans text-base text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="grid gap-x-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
            <dt className="font-sans text-base text-muted">Links</dt>
            <dd>
              <LinkRow>
                <UiLink href={p.repo}>Source</UiLink>
                {p.live && <UiLink href={p.live}>Play it</UiLink>}
              </LinkRow>
            </dd>
          </div>
        </dl>

        <FlowDiagram diagram={p.diagram} />

        <Block title="The problem">
          <p>{p.problem}</p>
        </Block>

        <Block title="What I built">
          <ul className="list-disc space-y-2 pl-5 marker:text-muted">
            {p.built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Block>

        <Block title="Decisions and what they cost">
          {p.decisions.map((d) => (
            <div key={d.choice} className="mt-7 first:mt-0">
              <h3 className="text-lg leading-snug">{d.choice}</h3>
              <p className="mt-2">
                <strong className="font-sans">Why: </strong>
                {d.why}
              </p>
              <p className="mt-2">
                <strong className="font-sans">Cost: </strong>
                {d.cost}
              </p>
            </div>
          ))}
        </Block>

        {p.didntWork && (
          <Block title="What didn’t work">
            <p>{p.didntWork}</p>
          </Block>
        )}

        <Block title="What I’d do next">
          <p>{p.nextTime}</p>
        </Block>

        <p className="mt-16 font-sans text-lg">
          Next case study:{' '}
          <Link to={`/work/${next.slug}`} viewTransition>
            {next.name}
          </Link>
        </p>
      </article>
    </Container>
  )
}
