import { chromium } from 'playwright'

const BASE = 'http://127.0.0.1:5173'
const VIEWPORTS = [
  { name: '320', width: 320, height: 720 },
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1366', width: 1366, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
]

const PAGES = ['/', '/login']

async function measureOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const body = document.body
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth)
    const clientWidth = doc.clientWidth
    const offenders = []
    for (const el of document.querySelectorAll('body *')) {
      if (!(el instanceof HTMLElement)) continue
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'visible') {
        const rect = el.getBoundingClientRect()
        if (rect.right > clientWidth + 2) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            className: String(el.className).slice(0, 80),
            right: Math.round(rect.right),
          })
        }
      }
    }
    return {
      clientWidth,
      scrollWidth,
      overflowX: scrollWidth > clientWidth + 1,
      offenders: offenders.slice(0, 5),
    }
  })
}

const browser = await chromium.launch({ headless: true })
const results = []

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await context.newPage()

  for (const path of PAGES) {
    const url = `${BASE}${path}`
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForTimeout(250)
      const measure = await measureOverflow(page)

      results.push({
        viewport: vp.name,
        path,
        overflowX: measure.overflowX,
        scrollWidth: measure.scrollWidth,
        clientWidth: measure.clientWidth,
        offenders: measure.offenders,
      })
    } catch (error) {
      results.push({ viewport: vp.name, path, error: String(error) })
    }
  }

  await context.close()
}

await browser.close()

const bad = results.filter((r) => r.error || r.overflowX)
console.log(JSON.stringify({ total: results.length, failures: bad.length, bad, sample: results.slice(0, 8) }, null, 2))
process.exit(bad.length ? 1 : 0)
