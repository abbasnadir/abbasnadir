import { Link } from 'react-router'
import { Evidence } from '../components/Evidence'
import { PacketField } from '../components/PacketField'
import { Container, EntryHead, LinkRow, Section, UiLink } from '../components/ui'
import { experience, openSource, projects, site } from '../content'

export function Home() {
  const nextcloud = openSource.find((o) => o.status === 'Merged')
  const firstImage = projects.find((p) => p.cover?.kind === 'image')?.slug

  return (
    <>
      <title>Abbas Nadir, backend developer</title>

      <Container className="pt-16 pb-6 sm:pt-24">
        <h1 className="page-title font-sans text-5xl leading-none font-bold tracking-tight sm:text-6xl">{site.name}</h1>
        <p className="mt-4 text-xl">
          {site.summary} {site.lede}
        </p>
        {/* DRAFT */}
        <p className="mt-3 text-muted">
          Backend intern at <Link to="/projects/restaurant-ordering" viewTransition>Digikraft</Link> this summer, a merged patch in{' '}
          {nextcloud && <a href={nextcloud.url}>Nextcloud</a>}, and now a video pipeline for{' '}
          <Link to="/about#experience" viewTransition>
            shoulder research
          </Link>{' '}
          at a hospital in Nagpur.
        </p>
        <LinkRow>
          <UiLink to="/resume">Résumé</UiLink>
          <UiLink href={site.links.github}>GitHub</UiLink>
          <UiLink href={`mailto:${site.email}`}>Email</UiLink>
        </LinkRow>
      </Container>

      <PacketField />

      <Container wide>
        <Section id="selected-work" title="Selected work" className="mt-6">
          <ul>
            {projects.map((p) => (
              <li
                key={p.slug}
                className="grid gap-x-12 gap-y-5 border-b border-rule py-10 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start"
              >
                <div className="max-w-page">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-2xl tracking-tight">
                      <Link to={`/projects/${p.slug}`} viewTransition className="ui-link text-accent">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="font-sans text-[0.9375rem] text-muted tabular-nums">{p.when}</p>
                  </div>
                  <p className="mt-2">{p.summary}</p>
                  <p className="mt-1 text-muted">{p.proof}</p>
                  <p className="mt-1 text-muted">{p.stack.join(', ')}</p>
                  <LinkRow>
                    <UiLink to={`/projects/${p.slug}`}>How it works</UiLink>
                    {p.live && <UiLink href={p.live}>Live</UiLink>}
                    {p.repo && <UiLink href={p.repo}>Code</UiLink>}
                  </LinkRow>
                </div>
                {p.cover && <Evidence evidence={p.cover} compact priority={p.slug === firstImage} />}
              </li>
            ))}
          </ul>
          <LinkRow>
            <UiLink to="/archive">Everything else I’ve built</UiLink>
          </LinkRow>
        </Section>
      </Container>

      <Container>
        <Section id="experience" title="Experience">
          {experience.slice(0, 3).map((job) => (
            <div key={job.title} className="mt-5">
              <EntryHead title={job.title} when={job.when} />
              <p className="text-muted">{job.org}</p>
            </div>
          ))}
          <LinkRow>
            <UiLink to="/about">More about me</UiLink>
          </LinkRow>
        </Section>

        <Section id="open-source" title="Patches sent upstream">
          {openSource.map((o) => (
            <div key={o.url} className="mt-5">
              <EntryHead
                title={
                  <a href={o.url} className="ui-link text-accent">
                    {o.repo} {o.pr}
                  </a>
                }
                when={o.status}
              />
              <p>{o.what}</p>
            </div>
          ))}
        </Section>

        <Section id="now" title="What I’m doing now">
          <p className="mt-4">{site.now}</p>
        </Section>
      </Container>
    </>
  )
}
