import { Container, LinkRow, UiLink } from '../components/ui'

// A cut thread: two node shapes with the line between them broken.
export function NotFound() {
  return (
    <Container>
      <title>Page not found, Abbas Nadir</title>
      <section className="pt-16 pb-8">
        <svg viewBox="0 0 320 40" className="h-10 w-80 max-w-full" aria-hidden="true">
          <circle cx="8" cy="20" r="6" fill="none" className="stroke-packet" strokeWidth="1.5" />
          <path d="M14 20 H140 L150 26" fill="none" className="stroke-packet" strokeWidth="1.5" />
          <path d="M172 14 L182 20 H300" fill="none" className="stroke-packet" strokeWidth="1.5" />
          <rect x="300" y="13" width="14" height="14" rx="2" fill="none" className="stroke-accent" strokeWidth="1.5" />
        </svg>
        <h1 className="page-title mt-8 font-sans text-4xl font-bold tracking-tight">There’s no page at this address.</h1>
        <p className="mt-4">It may have moved, or the link was mistyped.</p>
        <LinkRow>
          <UiLink to="/">Go to the homepage</UiLink>
          <UiLink to="/archive">See everything I’ve built</UiLink>
        </LinkRow>
      </section>
    </Container>
  )
}
