import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { site } from '../content'
import { CopyEmail } from './CopyEmail'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <ScrollManager />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {!isHome && (
        <p className="crumb">
          <Link to="/#projects" className="wordmark">
            {site.name}
          </Link>
        </p>
      )}
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p className="footer-lead">Email is the fastest way to reach me.</p>
        <CopyEmail email={site.email} />
        <ul className="footer-links">
          <li>
            <a href={site.links.github}>GitHub</a>
          </li>
          <li>
            <a href={site.links.linkedin}>LinkedIn</a>
          </li>
          <li>
            <a href={site.links.leetcode}>LeetCode</a>
          </li>
          <li>
            <a href="https://github.com/abbasnadir/abbasnadir">Source for this site</a>
          </li>
        </ul>
      </footer>
    </>
  )
}
