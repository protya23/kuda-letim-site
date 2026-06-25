// Build-time: dist/sitemap.xml + dist/robots.txt (Task 1-4 SEO).
// Включает главную (/) и ВСЕ страницы офферов (/offer/:id) из offers.json.
// Каталог — секция главной (/#catalog), поэтому канонический URL каталога = /.
// Базовый URL берётся из VITE_SITE_URL (задать в Vercel env); без него —
// плейсхолдер, который надо заменить (sitemap требует абсолютные URL).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const OFFERS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'offers.json'), 'utf8'))
const BASE = (process.env.VITE_SITE_URL || 'https://kuda-letim.vercel.app').replace(/\/$/, '')
const today = OFFERS.generatedAt || new Date().toISOString().slice(0, 10)

const urls = [
  { loc: `${BASE}/`, priority: '1.0', changefreq: 'daily' },                 // главная (+ каталог #catalog)
  ...OFFERS.offers.map((o) => ({ loc: `${BASE}/offer/${o.id}`, priority: '0.8', changefreq: 'daily' })),
]

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) =>
    `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod>` +
    `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n') +
  `\n</urlset>\n`

fs.mkdirSync(DIST, { recursive: true })
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml)

const robots =
  `User-agent: *\n` +
  `Allow: /\n` +
  `\n` +
  `Sitemap: ${BASE}/sitemap.xml\n`
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots)

const isPlaceholder = !process.env.VITE_SITE_URL
console.log(`[sitemap] ${urls.length} URL (1 главная + ${OFFERS.offers.length} офферов) → dist/sitemap.xml; dist/robots.txt` +
  (isPlaceholder ? `  ⚠️ base=${BASE} (плейсхолдер — задайте VITE_SITE_URL и пересоберите)` : `  base=${BASE}`))
