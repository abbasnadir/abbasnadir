import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { CaseStudy } from './pages/CaseStudy'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { OpenSource } from './pages/OpenSource'
import { Resume } from './pages/Resume'
import { Work } from './pages/Work'

// Static routes are also listed in scripts/spa-routes.mjs so GitHub Pages serves them with a 200.
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'work', element: <Work /> },
      { path: 'work/:slug', element: <CaseStudy /> },
      { path: 'about', element: <About /> },
      { path: 'open-source', element: <OpenSource /> },
      { path: 'resume', element: <Resume /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
