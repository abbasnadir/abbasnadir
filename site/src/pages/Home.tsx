import { Link } from 'react-router'
import { DiagramGlyph } from '../components/FlowDiagram'
import { Threads } from '../components/Threads'
import { Container, LinkRow, Section, UiLink } from '../components/ui'
import { experience, openSource, projects, site } from '../content'

export function Home() {
  const merged = openSource.find((o) => o.status === 'Merged')

  return (
    <>
      <title>Abbas Nadir, backend developer</title>

      <Container className="pt-16 pb-6 sm:pt-24">
        <h1 className="page-title font-sans text-5xl leading-none font-bold tracking-tight sm:text-6xl">{site.name}</h1>
        <p className="mt-4 text-xl text-muted">{site.summary}</p>
        <LinkRow>
          <UiLink href={`mailto:${site.email}`}>Email me</UiLink>
          <UiLink to="/resume">Read the résumé</UiLink>
          <UiLink href={site.links.github}>GitHub</UiLink>
        </LinkRow>
      </Container>

      <Threads />

      <Container>
        <Section id="selected-work" title="Selected work" className="mt-6">
          <ul className="mt-2">
            {projects.map((p) => (
              <li key={p.slug} className="grid gap-x-8 gap-y-3 border-b border-rule py-6 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-center">
                <div>
                  <h3 className="text-xl">
                    <Link to={`/work/${p.slug}`} viewTransition className="ui-link text-accent">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-1">{p.summary}</p>
                  <p className="mt-1 text-muted">{p.stack.slice(0, 4).join(', ')}</p>
                </div>
                <Link to={`/work/${p.slug}`} viewTransition tabIndex={-1} aria-hidden="true" className="hidden sm:block">
                  <DiagramGlyph diagram={p.diagram} />
                </Link>
              </li>
            ))}
          </ul>
          <LinkRow>
            <UiLink to="/work">See all projects</UiLink>
          </LinkRow>
        </Section>

        <Section id="now" title="What I’m working on">
          <p className="mt-4">{site.now}</p>
          <p className="mt-3 text-muted">
            Before that I was a backend intern at {experience[1].org} ({experience[1].when}).
          </p>
          <LinkRow>
            <UiLink to="/about">More about me</UiLink>
          </LinkRow>
        </Section>

        {merged && (
          <Section id="recently-merged" title="Recently merged upstream">
            <p className="mt-4">
              <a href={merged.url}>
                {merged.repo} {merged.pr}
              </a>
              : {merged.what}
            </p>
            <LinkRow>
              <UiLink to="/open-source">All open-source work</UiLink>
            </LinkRow>
          </Section>
        )}
      </Container>
    </>
  )
}
