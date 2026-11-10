import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Archive } from './pages/Archive'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Project } from './pages/Project'
import { Resume } from './pages/Resume'

// Static routes are also listed in scripts/spa-routes.mjs so GitHub Pages serves them with a 200.
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects/:slug', element: <Project /> },
      { path: 'archive', element: <Archive /> },
      { path: 'about', element: <About /> },
      { path: 'resume', element: <Resume /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
