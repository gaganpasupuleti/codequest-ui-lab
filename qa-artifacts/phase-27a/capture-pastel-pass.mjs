import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const phase = process.argv[2] ?? 'before'
const baseUrl = process.env.LANDING_URL ?? 'http://localhost:5173/'

const shots = [
  { name: 'fullpage', selector: null, fullPage: true },
  { name: 'career-map', selector: '#career-map' },
  { name: 'quest-arenas', selector: '#quest-arenas' },
  { name: 'platform-showcase', selector: '#platform-showcase' },
  { name: 'feature-story', selector: '#features' },
  { name: 'final-cta', selector: '#final-cta' },
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

for (const shot of shots) {
  const file = path.join(dir, `pastel-${shot.name}-${phase}.png`)
  if (shot.fullPage) {
    await page.screenshot({ path: file, fullPage: true })
  } else {
    const el = page.locator(shot.selector).first()
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await el.screenshot({ path: file })
  }
  console.log(`saved ${path.basename(file)}`)
}

await page.setViewportSize({ width: 390, height: 844 })
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({
  path: path.join(dir, `pastel-fullpage-mobile-${phase}.png`),
  fullPage: true,
})
console.log(`saved pastel-fullpage-mobile-${phase}.png`)

await browser.close()

if (phase === 'after') {
  const compareNames = shots.map((s) => s.name).concat(['fullpage-mobile'])
  for (const name of compareNames) {
    const beforePath = path.join(dir, `pastel-${name}-before.png`)
    const afterPath = path.join(dir, `pastel-${name}-after.png`)
    if (!fs.existsSync(beforePath) || !fs.existsSync(afterPath)) continue

    const b = await chromium.launch()
    const p = await b.newPage()
    const beforeB64 = fs.readFileSync(beforePath).toString('base64')
    const afterB64 = fs.readFileSync(afterPath).toString('base64')
    await p.setContent(`<!doctype html><html><body style="margin:0;background:#111">
      <div style="display:flex;gap:0">
        <div><div style="background:#333;color:#fff;font:600 14px sans-serif;padding:8px 12px">BEFORE</div><img src="data:image/png;base64,${beforeB64}" style="display:block;max-width:720px;height:auto"/></div>
        <div><div style="background:#1944F1;color:#fff;font:600 14px sans-serif;padding:8px 12px">AFTER</div><img src="data:image/png;base64,${afterB64}" style="display:block;max-width:720px;height:auto"/></div>
      </div></body></html>`)
    await p.waitForTimeout(300)
    const out = path.join(dir, `compare-${name}.png`)
    await p.locator('body').screenshot({ path: out })
    await b.close()
    console.log(`saved compare-${name}.png`)
  }
}

console.log('done')
