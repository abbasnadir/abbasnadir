import { Container, EntryHead, LinkRow, PageHeader, Section, UiLink } from '../components/ui'
import { openSource, otherProjects } from '../content'

const published = ['Lock Keys', 'Supabase backend template', 'Blink Bot']

export function OpenSource() {
  const mine = otherProjects.filter((p) => published.includes(p.name))

  return (
    <>
      <title>Open source, Abbas Nadir</title>
      <Container>
        <PageHeader title="Open source" lede="Patches I’ve sent to other people’s projects, and the tools I publish." />

        <Section id="upstream" title="Upstream pull requests" className="mt-4">
          {openSource.map((o) => (
            <div key={o.url} className="mt-6">
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

        <Section id="published" title="Tools I publish">
          {mine.map((p) => (
            <div key={p.url} className="mt-6">
              <EntryHead
                title={
                  <a href={p.url} className="ui-link text-accent">
                    {p.name}
                  </a>
                }
              />
              <p>{p.what}</p>
              <p className="text-muted">{p.stack.join(', ')}</p>
            </div>
          ))}
          <LinkRow>
            <UiLink href="https://github.com/abbasnadir?tab=repositories">Everything on GitHub</UiLink>
          </LinkRow>
        </Section>
      </Container>
    </>
  )
}
