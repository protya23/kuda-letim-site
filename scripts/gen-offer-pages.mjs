// Post-build: write a static dist/offer/<id>/index.html per offer with correct
// <title> + meta description + Open Graph tags (image = the offer photo).
// Crawlers / social cards that hit /offer/<id> directly get real per-offer meta,
// then the SPA (BrowserRouter) renders the page client-side.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const OFFERS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'offers.json'), 'utf8'))
const SITE_URL = (process.env.VITE_SITE_URL || '').replace(/\/$/, '')

const indexHtml = path.join(DIST, 'index.html')
if (!fs.existsSync(indexHtml)) { console.error('[offer-pages] dist/index.html not found — run vite build first'); process.exit(0) }
const template = fs.readFileSync(indexHtml, 'utf8')

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function pageFor(o) {
  const title = `${o.title}, ${o.country} — ${o.ourPriceLabel} (−${o.discountPercent}%) | Куда летим?`
  const desc = `${o.title} (${o.country}): обычная ${o.marketPriceLabel}, для клиентов ${o.ourPriceLabel}, экономия ${o.saveLabel}. ${o.description}`
  const url = SITE_URL ? `${SITE_URL}/offer/${o.id}` : ''
  const img = o.image ? (SITE_URL ? SITE_URL + o.image : o.image) : ''
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`)
  // inject og:image/og:url + twitter card
  const extra =
    (img ? `<meta property="og:image" content="${esc(img)}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="${esc(img)}" />` : '') +
    (url ? `<meta property="og:url" content="${esc(url)}" /><link rel="canonical" href="${esc(url)}" />` : '')
  html = html.replace('</head>', `${extra}</head>`)
  return html
}

let n = 0
for (const o of OFFERS.offers || []) {
  const dir = path.join(DIST, 'offer', o.id)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), pageFor(o))
  n++
}
console.log(`[offer-pages] wrote ${n} static offer pages -> dist/offer/<id>/index.html${SITE_URL ? ` (base ${SITE_URL})` : ' (relative — set VITE_SITE_URL for absolute OG)'}`)
