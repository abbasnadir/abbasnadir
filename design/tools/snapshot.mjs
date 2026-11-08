// Saves fully rendered HTML of each route with the bundled CSS inlined, so static
// linters (sloplint, anti-slop) can read what the browser actually shows.
// Usage: node snapshot.mjs <out-dir> [route ...]   (default routes: / and /work/metricflow)
import { mkdirSync, writeFileSync } from 'node:fs'
import { BASE, launch } from './browser.mjs'

const [out = 'snapshots', ...routes] = process.argv.slice(2)
const targets = routes.length ? routes : ['/', '/work/metricflow']
mkdirSync(out, { recursive: true })

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
for (const route of targets) {
  await page.goto(BASE + route)
  await page.waitForTimeout(500)
  const html = await page.evaluate(async () => {
    for (const link of [...document.querySelectorAll('link[rel="stylesheet"]')]) {
      const css = await (await fetch(link.href)).text()
      const style = document.createElement('style')
      style.textContent = css.replace(/@font-face\{[^}]*\}/g, '')
      link.replaceWith(style)
    }
    document.querySelectorAll('script').forEach((s) => s.remove())
    return '<!doctype html>\n' + document.documentElement.outerHTML
  })
  const name = route === '/' ? 'home' : route.split('/').filter(Boolean).pop()
  writeFileSync(`${out}/${name}.html`, html)
}
await browser.close()
console.log(`snapshot: ${targets.length} page(s) in ${out}`)
