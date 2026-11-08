import { Link, useParams } from 'react-router'
import { FlowDiagram } from '../components/FlowDiagram'
import { projects } from '../content'
import { NotFound } from './NotFound'

export function CaseStudy() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return <NotFound />
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="page case">
      <title>{`${p.name}, a case study by Abbas Nadir`}</title>
      <meta name="description" content={p.summary} />

      <header className="case-head">
        <h1>{p.name}</h1>
        <p className="case-lede">{p.summary}</p>
        <dl className="case-meta">
          <div>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{p.when}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{p.stack.join(', ')}</dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd className="entry-links">
              <a href={p.repo}>Source</a>
              {p.live && <a href={p.live}>Play it</a>}
            </dd>
          </div>
        </dl>
      </header>

      <FlowDiagram diagram={p.diagram} />

      <section className="case-section">
        <h2>The problem</h2>
        <p>{p.problem}</p>
      </section>

      <section className="case-section">
        <h2>What I built</h2>
        <ul className="points">
          {p.built.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="case-section">
        <h2>Decisions and what they cost</h2>
        {p.decisions.map((d) => (
          <div key={d.choice} className="decision">
            <h3>{d.choice}</h3>
            <p>
              <strong>Why: </strong>
              {d.why}
            </p>
            <p>
              <strong>Cost: </strong>
              {d.cost}
            </p>
          </div>
        ))}
      </section>

      {p.didntWork && (
        <section className="case-section">
          <h2>What didn’t work</h2>
          <p>{p.didntWork}</p>
        </section>
      )}

      <section className="case-section">
        <h2>What I’d do next</h2>
        <p>{p.nextTime}</p>
      </section>

      <p className="case-next">
        Next case study: <Link to={`/work/${next.slug}`}>{next.name}</Link>
      </p>
    </article>
  )
}
