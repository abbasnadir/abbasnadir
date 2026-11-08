import { Link } from 'react-router'
import { Container, EntryHead, LinkRow, Section, UiLink } from '../components/ui'
import { education, experience, hackathons, openSource, projects, site, skills } from '../content'

// The one-page resume as a web page: same order and emphasis as the PDF, printable.
export function Resume() {
  return (
    <>
      <title>Résumé, Abbas Nadir</title>
      <Container>
        <header className="pt-12 pb-4 sm:pt-16">
          <h1 className="page-title font-sans text-4xl font-bold tracking-tight sm:text-5xl">{site.name}</h1>
          <p className="mt-3 text-xl text-muted">{site.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-sans text-base">
            <li>
              <a href={`mailto:${site.email}`} className="ui-link">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.links.github} className="ui-link">
                github.com/abbasnadir
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} className="ui-link">
                LinkedIn
              </a>
            </li>
          </ul>
          <div className="no-print">
            <LinkRow>
              <UiLink href={site.resume}>Download the PDF</UiLink>
              <button type="button" onClick={() => window.print()} className="ui-link press cursor-pointer bg-transparent p-0 text-accent">
                Print this page
              </button>
            </LinkRow>
          </div>
        </header>

        <Section id="r-experience" title="Experience" className="mt-8">
          {experience.map((job) => (
            <div key={job.title} className="mt-5">
              <EntryHead title={job.title} when={job.when} />
              <p className="text-muted">{job.org}</p>
              {job.points.length > 0 && (
                <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-muted">
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>

        <Section id="r-projects" title="Selected projects" className="mt-10">
          {projects.map((p) => (
            <div key={p.slug} className="mt-5">
              <EntryHead
                title={
                  <Link to={`/work/${p.slug}`} viewTransition className="ui-link text-accent">
                    {p.name}
                  </Link>
                }
                when={p.when}
              />
              <p>{p.summary}</p>
              <p className="text-muted">{p.stack.join(', ')}</p>
            </div>
          ))}
        </Section>

        <Section id="r-education" title="Education" className="mt-10">
          <div className="mt-5">
            <EntryHead title={education.degree} when={education.when} />
            <p className="text-muted">
              {education.school}. {education.note}
            </p>
          </div>
        </Section>

        <Section id="r-open-source" title="Open source and hackathons" className="mt-10">
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
          {hackathons.map((h) => (
            <div key={h.event} className="mt-5">
              <EntryHead title={h.event} when={h.place} />
              <p>{h.what}</p>
            </div>
          ))}
        </Section>

        <Section id="r-skills" title="Skills" className="mt-10">
          <dl className="mt-4">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-x-4 py-1 sm:grid-cols-[6rem_minmax(0,1fr)]">
                <dt className="font-sans font-semibold">{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </Container>
    </>
  )
}
