import { Container, PageHeader } from '../components/ui'
import { archive } from '../content'

export function Archive() {
  return (
    <>
      <title>Archive, Abbas Nadir</title>
      <Container wide>
        <PageHeader title="Archive" lede="Everything else I’ve built, newest first." />

        <table className="w-full border-collapse text-left">
          <thead className="font-sans text-[0.9375rem] text-muted">
            <tr className="border-b border-rule">
              <th scope="col" className="w-16 py-2 pr-4 font-normal">
                Year
              </th>
              <th scope="col" className="py-2 pr-6 font-normal">
                Project
              </th>
              <th scope="col" className="hidden py-2 pr-6 font-normal md:table-cell">
                Built with
              </th>
              <th scope="col" className="py-2 font-normal">
                Links
              </th>
            </tr>
          </thead>
          <tbody>
            {archive.map((a) => (
              <tr key={a.name} className="border-b border-rule align-baseline">
                <td className="py-4 pr-4 font-sans text-[0.9375rem] text-muted tabular-nums">{a.year}</td>
                <td className="py-4 pr-6">
                  <span className="font-sans font-semibold">{a.name}</span>
                  <span className="block text-muted">{a.what}</span>
                </td>
                <td className="hidden py-4 pr-6 font-sans text-[0.9375rem] text-muted md:table-cell">{a.stack.join(', ')}</td>
                <td className="py-4 font-sans text-base whitespace-nowrap">
                  {a.live && (
                    <a href={a.live} className="ui-link mr-4 text-accent">
                      Live
                    </a>
                  )}
                  {a.code ? (
                    <a href={a.code} className="ui-link text-accent">
                      Code
                    </a>
                  ) : (
                    <span className="text-muted">Private</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </>
  )
}
