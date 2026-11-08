import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PacketField } from '../components/PacketField'
import { education, experience, hackathons, openSource, projects, site, skills, smallerThings } from '../content'

export function Home() {
  return (
    <>
      <title>Abbas Nadir, backend developer</title>

      <header className="masthead">
        <h1>{site.name}</h1>
        <p className="summary">{site.summary}</p>
        <ul className="contact" aria-label="Contact">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={site.resume}>Résumé (PDF)</a>
          </li>
          <li>
            <a href={site.links.github}>GitHub</a>
          </li>
          <li>
            <a href={site.links.linkedin}>LinkedIn</a>
          </li>
        </ul>
      </header>

      <PacketField />

      <div className="page">
        <Section id="experience" title="Experience">
          {experience.map((job) => (
            <article key={job.title} className="entry">
              <EntryHead title={job.title} when={job.when} />
              <p className="secondary">{job.org}</p>
              {job.points.length > 0 && (
                <ul className="points">
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Section>

        <Section id="projects" title="Projects with case studies">
          {projects.map((p) => (
            <article key={p.slug} className="entry">
              <EntryHead title={<Link to={`/work/${p.slug}`}>{p.name}</Link>} when={p.when} />
              <p>{p.summary}</p>
              <p className="secondary">{p.stack.join(', ')}</p>
              <p className="entry-links">
                <Link to={`/work/${p.slug}`}>Read the case study</Link>
                <a href={p.repo}>Source</a>
                {p.live && <a href={p.live}>Play it</a>}
              </p>
            </article>
          ))}
        </Section>

        <Section id="education" title="Education">
          <article className="entry">
            <EntryHead title={education.degree} when={education.when} />
            <p className="secondary">
              {education.school}. {education.note}
            </p>
          </article>
        </Section>

        <Section id="open-source" title="Open source">
          {openSource.map((o) => (
            <article key={o.url} className="entry">
              <EntryHead
                title={
                  <a href={o.url}>
                    {o.repo} {o.pr}
                  </a>
                }
                when={o.status}
              />
              <p>{o.what}</p>
            </article>
          ))}
        </Section>

        <Section id="hackathons" title="Hackathons">
          {hackathons.map((h) => (
            <article key={h.event} className="entry">
              <EntryHead title={h.event} when={h.place} />
              <p>{h.what}</p>
            </article>
          ))}
        </Section>

        <Section id="other" title="Other projects">
          {smallerThings.map((s) => (
            <article key={s.url} className="entry">
              <h3 className="entry-title">
                <a href={s.url}>{s.name}</a>
              </h3>
              <p>{s.what}</p>
            </article>
          ))}
        </Section>

        <Section id="skills" title="Skills">
          <dl className="skills">
            {skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  )
}

function EntryHead({ title, when }: { title: ReactNode; when: string }) {
  return (
    <div className="entry-head">
      <h3 className="entry-title">{title}</h3>
      <p className="when">{when}</p>
    </div>
  )
}
