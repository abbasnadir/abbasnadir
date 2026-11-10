// Smoke test for the interactive parts: the packet band under a moving pointer, nav view
// transitions, project pages and their evidence, the archive, the timeline and the copy button.
// Fails on any console error.
// Usage: node interactions.mjs   (expects the site on $BASE, default http://localhost:4317)
import { BASE, launch } from './browser.mjs'

const browser = await launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE })
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
const check = (ok, label) => {
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label}`)
  if (!ok) process.exitCode = 1
}

await page.goto(BASE + '/')

// Sweep across the packet band; the canvas should keep rendering without errors.
const band = await page.locator('canvas.wire').boundingBox()
for (let x = band.x + 40; x < band.x + band.width - 40; x += 60) await page.mouse.move(x, band.y + band.height / 2)
await page.mouse.move(0, 0)
await page.waitForTimeout(400)
check(true, 'packet band survives pointer sweep')

const featured = await page.locator('#selected-work li').count()
check(featured === 3, `home lists 3 featured projects (got ${featured})`)

for (const [label, path, title] of [
  ['Archive', '/archive', 'Archive'],
  ['About', '/about', 'About me'],
  ['Résumé', '/resume', 'Abbas Nadir'],
]) {
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label }).click()
  await page.waitForURL(BASE + path)
  await page.waitForTimeout(300)
  const h1 = (await page.locator('h1').first().textContent())?.trim()
  const threads = await page.locator('.nav-thread').count()
  check(h1 === title && threads === 1, `nav to ${path}: h1 "${h1}", one nav thread`)
}

await page.goto(BASE + '/archive')
const rows = await page.locator('tbody tr').count()
check(rows >= 10, `archive table has ${rows} rows`)

await page.goto(BASE + '/about')
await page.locator('ol').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
check((await page.locator('ol.is-seen').count()) === 1, 'timeline draws once in view')

await page.goto(BASE + '/')
await page.getByRole('link', { name: 'How it works' }).first().click()
await page.waitForURL(/\/projects\/hangman-v2$/)
await page.waitForTimeout(300)
check((await page.locator('h1').first().textContent())?.trim() === 'Hangman V2', 'How it works opens the project page')
check((await page.locator('figure img').count()) === 1, 'project page shows its screenshot')
check((await page.locator('figure pre code').count()) >= 1, 'project page shows a code excerpt')
const font = await page.locator('pre code').first().evaluate((el) => getComputedStyle(el).fontFamily)
check(!/mono/i.test(font), `code excerpt uses no monospace (${font.split(',')[0]})`)

await page.getByRole('link', { name: 'Restaurant ordering app' }).click()
await page.waitForURL(/\/projects\/restaurant-ordering$/)
check((await page.locator('a[href*="Restaurant-App"]').count()) === 0, 'internship page links no private code')

await page.getByRole('button', { name: 'Copy address' }).click()
await page.waitForTimeout(100)
check((await page.locator('.spark').count()) > 0, 'copy button bursts')
check((await page.evaluate(() => navigator.clipboard.readText())) === 'abbasnadir.dev@proton.me', 'email copied to clipboard')

check(errors.length === 0, `no console errors${errors.length ? ': ' + errors.join(' | ') : ''}`)
await browser.close()
