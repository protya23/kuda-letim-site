// Health-check сайта (Task 3). Запуск: npm run site:check  (сначала делает build).
// Проверяет: offers.json есть; офферов > 0; все фото существуют; все Booking URL
// реальные (/hotel/); все Telegram содержат traveI_j; все страницы /offer/:id
// сгенерированы (dist/offer/<id>/index.html). Падает с кодом 1 при любой ошибке.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_JSON = path.join(ROOT, 'src', 'data', 'offers.json')
const PUB = path.join(ROOT, 'public', 'offers')
const DIST_OFFER = path.join(ROOT, 'dist', 'offer')

const checks = []
const add = (name, ok, detail = '') => checks.push({ name, ok, detail })

// 1) offers.json
let data = null
if (!fs.existsSync(OUT_JSON)) {
  add('offers.json существует', false, OUT_JSON)
} else {
  add('offers.json существует', true)
  try { data = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8')) } catch (e) { add('offers.json валиден', false, String(e)) }
}
const offers = data?.offers || []

// 2) офферов > 0
add('офферов > 0', offers.length > 0, `${offers.length}`)

// 3-5) пофайловые проверки
const noImg = [], badBk = [], noTg = [], noPage = []
for (const o of offers) {
  const imgName = (o.image || '').split('/').pop()
  if (!o.image || !fs.existsSync(path.join(PUB, imgName))) noImg.push(o.id)
  if (!o.booking || !o.booking.includes('/hotel/')) badBk.push(o.id)
  if (!o.telegram || !o.telegram.includes('traveI_j')) noTg.push(o.id)
  if (!fs.existsSync(path.join(DIST_OFFER, o.id, 'index.html'))) noPage.push(o.id)
}
add('все фото существуют', noImg.length === 0, noImg.length ? `нет: ${noImg.join(',')}` : '')
add('все Booking URL = /hotel/', badBk.length === 0, badBk.length ? `плохие: ${badBk.join(',')}` : '')
add('все Telegram = traveI_j', noTg.length === 0, noTg.length ? `нет: ${noTg.join(',')}` : '')
add(`все страницы /offer/:id (${offers.length})`, noPage.length === 0, noPage.length ? `нет: ${noPage.join(',')}` : '')

// 6) sitemap.xml — главная + все офферы
const SITEMAP = path.join(ROOT, 'dist', 'sitemap.xml')
const ROBOTS = path.join(ROOT, 'dist', 'robots.txt')
if (!fs.existsSync(SITEMAP)) {
  add('sitemap.xml сгенерирован', false)
} else {
  const sm = fs.readFileSync(SITEMAP, 'utf8')
  add('sitemap.xml сгенерирован', true)
  add('главная в sitemap', /<loc>[^<]*\/<\/loc>/.test(sm))
  const missing = offers.filter((o) => !sm.includes(`/offer/${o.id}<`))
  add(`все офферы в sitemap (${offers.length})`, missing.length === 0, missing.length ? `нет: ${missing.map((o) => o.id).join(',')}` : '')
}
// 7) robots.txt + Sitemap-директива
if (!fs.existsSync(ROBOTS)) add('robots.txt сгенерирован', false)
else { const rb = fs.readFileSync(ROBOTS, 'utf8'); add('robots.txt + Sitemap', /Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/.test(rb)) }
// 8) canonical на странице оффера
const sampleOffer = offers[0] && path.join(DIST_OFFER, offers[0].id, 'index.html')
if (sampleOffer && fs.existsSync(sampleOffer)) {
  add('canonical на /offer/:id', /<link rel="canonical"/.test(fs.readFileSync(sampleOffer, 'utf8')))
}

// вывод
console.log('\n🔎 SITE HEALTH-CHECK\n' + '─'.repeat(46))
let failed = 0
for (const c of checks) {
  console.log(`${c.ok ? '✅' : '❌'} ${c.name}${c.detail ? '  — ' + c.detail : ''}`)
  if (!c.ok) failed++
}
console.log('─'.repeat(46))
if (failed === 0) {
  console.log(`✅ ВСЁ ОК — сайт готов к деплою. Офферов: ${offers.length}, страниц: ${offers.length}.\n`)
  process.exit(0)
} else {
  console.log(`❌ ПРОВАЛЕНО проверок: ${failed}. Деплой НЕ рекомендуется до исправления.\n`)
  process.exit(1)
}
