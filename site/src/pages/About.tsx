import { Timeline } from '../components/Timeline'
import { Container, EntryHead, PageHeader, Section } from '../components/ui'
import { education, experience, hackathons, site, skills } from '../content'

export function About() {
  return (
    <>
      <title>About, Abbas Nadir</title>
      <Container>
        <PageHeader title="About me" />

        <div className="space-y-4">
          {site.bio.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <Section id="experience" title="Experience">
          <Timeline jobs={experience} />
        </Section>

        <Section id="education" title="Education">
          <div className="mt-6">
            <EntryHead title={education.degree} when={education.when} />
            <p className="text-muted">
              {education.school}. {education.note}
            </p>
          </div>
        </Section>

        <Section id="hackathons" title="Hackathons">
          {hackathons.map((h) => (
            <div key={h.event} className="mt-6">
              <EntryHead title={h.event} when={h.place} />
              <p>{h.what}</p>
            </div>
          ))}
        </Section>

        <Section id="skills" title="Skills">
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
