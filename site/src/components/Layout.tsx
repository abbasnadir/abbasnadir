import { useEffect } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { site } from '../content'
import { CopyEmail } from './CopyEmail'
import { Container } from './ui'

const nav = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/open-source', label: 'Open source' },
  { to: '/resume', label: 'Résumé' },
]

function HashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])
  return null
}

export function Layout() {
  return (
    <>
      <ScrollRestoration />
      <HashScroll />
      <a
        href="#main"
        className="absolute -top-16 left-4 z-10 bg-ink px-3 py-2 font-sans text-paper no-underline focus:top-4"
      >
        Skip to content
      </a>

      {/* Nav is a left cluster after the wordmark; the current page is marked by a thread that slides between items. */}
      <Container wide className="no-print">
        <header className="flex flex-wrap items-baseline gap-x-8 gap-y-3 pt-6">
          <Link to="/" viewTransition className="wordmark text-lg">
            {site.name}
          </Link>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-base">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    viewTransition
                    className={({ isActive }) =>
                      `relative no-underline transition-[color] duration-[120ms] ease-swift ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <span className="nav-thread" aria-hidden="true" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </header>
      </Container>

      <main id="main">
        <Outlet />
      </main>

      <footer className="no-print mt-24 border-t border-rule">
        <Container className="pt-10 pb-16">
          <p className="font-sans text-xl font-semibold">Email is the fastest way to reach me.</p>
          <div className="mt-3">
            <CopyEmail email={site.email} />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-base">
            <li>
              <a href={site.links.github} className="ui-link">
                GitHub
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} className="ui-link">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.links.leetcode} className="ui-link">
                LeetCode
              </a>
            </li>
            <li>
              <a href="https://github.com/abbasnadir/abbasnadir" className="ui-link">
                Source for this site
              </a>
            </li>
          </ul>
        </Container>
      </footer>
    </>
  )
}
