// GitHub Pages has no SPA rewrites. Copy index.html into each known route so deep
// links return 200, and into 404.html so unknown routes still load the app.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const index = join(dist, 'index.html')

// Keep in sync with the routes in src/App.tsx.
const pages = ['work', 'about', 'open-source', 'resume']
const content = readFileSync(join(root, 'src/content.ts'), 'utf8')
const slugs = [...content.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])
const routes = [...pages, ...slugs.map((s) => `work/${s}`)]

for (const route of routes) {
  const dir = join(dist, route)
  mkdirSync(dir, { recursive: true })
  copyFileSync(index, join(dir, 'index.html'))
}
copyFileSync(index, join(dist, '404.html'))

const urls = ['/', ...routes.map((r) => `/${r}`)]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>https://abbasnadir.tech${u}</loc></url>`).join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://abbasnadir.tech/sitemap.xml\n')

console.log(`spa-routes: ${routes.length} routes, 404.html, sitemap.xml, robots.txt`)
