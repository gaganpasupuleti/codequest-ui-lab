import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const baseUrl = 'http://localhost:5173/'

const sections = [
  { id: 'hero', selector: '#hero' },
  { id: 'career-map', selector: '#career-map' },
  { id: 'platform-showcase', selector: '#platform-showcase' },
  { id: 'final-cta', selector: '#final-cta' },
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

for (const section of sections) {
  const el = page.locator(section.selector).first()
  if ((await el.count()) > 0) {
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await el.screenshot({
      path: path.join(dir, `color-${section.id}-desktop-after.png`),
    })
    console.log(`captured ${section.id}`)
  } else {
    console.warn(`missing ${section.id} (${section.selector})`)
  }
}

await page.screenshot({
  path: path.join(dir, 'color-fullpage-desktop-after.png'),
  fullPage: true,
})

await page.setViewportSize({ width: 390, height: 844 })
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({
  path: path.join(dir, 'color-fullpage-mobile-after.png'),
  fullPage: true,
})

await browser.close()
console.log('done')
