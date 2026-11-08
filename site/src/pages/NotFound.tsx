import { Link } from 'react-router'

export function NotFound() {
  return (
    <section className="page not-found">
      <title>Page not found, Abbas Nadir</title>
      <h1>There’s no page at this address.</h1>
      <p>
        It may have moved. <Link to="/">Go to the homepage</Link> to find the projects and case studies.
      </p>
    </section>
  )
}
