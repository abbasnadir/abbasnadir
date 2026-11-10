import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { Evidence } from '../components/Evidence'
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

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-x-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
      <dt className="font-sans text-base text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function Project() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return <NotFound />
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]

  return (
    <Container>
      <article>
        <title>{`How ${p.name} works, by Abbas Nadir`}</title>
        <meta name="description" content={p.summary} />

        <PageHeader title={p.name} lede={p.summary} />

        <dl className="-mt-4 mb-10 grid gap-2">
          <Fact label="Role">{p.role}</Fact>
          <Fact label="When">{p.when}</Fact>
          <Fact label="Stack">{p.stack.join(', ')}</Fact>
          <Fact label="Links">
            {p.closed ? (
              <span className="text-muted">{p.closed}</span>
            ) : (
              <LinkRow>
                {p.live && <UiLink href={p.live}>Live</UiLink>}
                {p.repo && <UiLink href={p.repo}>Code</UiLink>}
              </LinkRow>
            )}
          </Fact>
        </dl>

        {p.cover?.kind === 'image' && <Evidence evidence={p.cover} priority />}

        <Block title="The problem">
          <p>{p.problem}</p>
        </Block>

        {p.firstTry && (
          <Block title="Where it started">
            <p>{p.firstTry}</p>
          </Block>
        )}

        <Block title="How it works">
          <div className="space-y-6">
            {p.how.map((step) => (
              <div key={step.text} className="space-y-4">
                <p>{step.text}</p>
                {step.evidence && <Evidence evidence={step.evidence} />}
              </div>
            ))}
            {p.cover?.kind === 'code' && <Evidence evidence={p.cover} />}
          </div>
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

        <Block title="What’s missing">
          <ul className="list-disc space-y-2 pl-5 marker:text-muted">
            {p.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </Block>

        {p.next && (
          <Block title="What I’d do next">
            <p>{p.next}</p>
          </Block>
        )}

        <p className="mt-16 font-sans text-lg">
          Next project:{' '}
          <Link to={`/projects/${next.slug}`} viewTransition>
            {next.name}
          </Link>
        </p>
      </article>
    </Container>
  )
}
