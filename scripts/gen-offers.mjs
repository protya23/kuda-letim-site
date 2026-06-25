// ============================================================================
// Telegram → Website bridge (Task 1 + 4).
// READ-ONLY on the source. Reads the SAME data the bot publishes:
//   ../travel_posts/<latest>/H*/ (metadata.json + cover.jpg + post.txt)
//   ../travel_bot/photo_registry.json  (verified primary photo per hotel)
// Produces src/data/offers.json + copies photos to public/offers/.
// Every new generated offer therefore appears on the site automatically
// (run this after generate_daily — see deploy/sync_site.sh).
// NEVER writes to ../travel_posts or ../travel_bot.
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const POSTS = path.resolve(ROOT, '..', 'travel_posts')
const BOT = path.resolve(ROOT, '..', 'travel_bot')
const OUT_IMG = path.join(ROOT, 'public', 'offers')
const OUT_JSON = path.join(ROOT, 'src', 'data', 'offers.json')

const TG_MANAGER = 'traveI_j'           // capital latin I
const TG_CHANNEL = 'zxockerwobk'
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || '' // e.g. 79991234567 (optional)

fs.mkdirSync(OUT_IMG, { recursive: true })
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true })

const fmtRub = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
const tgManagerText = (hotel) =>
  `https://t.me/${TG_MANAGER}?text=${encodeURIComponent('Хочу проверить цену на ' + hotel)}`
const waText = (hotel) =>
  WHATSAPP_PHONE
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Хочу проверить цену на ' + hotel)}`
    : null

function budgetBucket(price) {
  if (price < 100000) return 'до 100к'
  if (price < 200000) return '100–200к'
  if (price < 300000) return '200–300к'
  return '300к+'
}

function latestDateDir() {
  if (!fs.existsSync(POSTS)) return null
  const dirs = fs.readdirSync(POSTS)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && fs.statSync(path.join(POSTS, d)).isDirectory())
    .sort()
  return dirs.length ? dirs[dirs.length - 1] : null
}

function loadRegistry() {
  const p = path.join(BOT, 'photo_registry.json')
  if (!fs.existsSync(p)) return null
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return null }
}

// primary photo path from registry (verified) by hotel name
function registryPrimary(reg, name) {
  if (!reg) return null
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toUpperCase()
  const rec = Object.values(reg.hotels || {}).find((h) => norm(h.hotel_name) === norm(name))
  if (!rec || rec.status !== 'OK' || !rec.photos?.length) return null
  const local = path.join(BOT, rec.photos[0].local)
  return fs.existsSync(local) ? { local, subject: rec.photos[0].subject, booking: rec.original_booking_url || rec.booking_url } : null
}

// short selling description from post.txt (the 💖 line) + facts
function descriptionFrom(body, m) {
  let tagline = ''
  for (const ln of (body || '').split('\n')) {
    const t = ln.trim()
    if (t.startsWith('💖')) { tagline = t.replace('💖', '').trim(); break }
  }
  const bits = []
  if (m.nights) bits.push(`${m.nights} ночей`)
  if (m.flight_included) bits.push('перелёт включён')
  const facts = bits.join(' · ')
  return tagline || (m.room_type ? `${m.room_type}. ${facts}` : facts) || 'Закрытое предложение для клиентов.'
}

function fromRealData() {
  const date = latestDateDir()
  if (!date) return null
  const dir = path.join(POSTS, date)
  const reg = loadRegistry()
  const hotelDirs = fs.readdirSync(dir).filter((d) => /^H\d+$/.test(d))
    .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
  const offers = []
  for (const h of hotelDirs) {
    const metaPath = path.join(dir, h, 'metadata.json')
    if (!fs.existsSync(metaPath)) continue
    let m
    try { m = JSON.parse(fs.readFileSync(metaPath, 'utf8')) } catch { continue }
    if (m.quality_gate && m.quality_gate.passed === false) continue

    const body = fs.existsSync(path.join(dir, h, 'post.txt'))
      ? fs.readFileSync(path.join(dir, h, 'post.txt'), 'utf8') : ''

    // photo: prefer verified registry primary, fallback to batch cover.jpg
    let img = null, subject = null, booking = m.source_url || null
    const rp = registryPrimary(reg, m.title)
    const dest = `${m.post_id}.jpg`
    if (rp) {
      fs.copyFileSync(rp.local, path.join(OUT_IMG, dest)); img = `/offers/${dest}`
      subject = rp.subject; booking = rp.booking || booking
    } else if (fs.existsSync(path.join(dir, h, 'cover.jpg'))) {
      fs.copyFileSync(path.join(dir, h, 'cover.jpg'), path.join(OUT_IMG, dest)); img = `/offers/${dest}`
    }

    const market = m.market_price_rub, ours = m.our_price_rub
    offers.push({
      id: m.post_id,
      title: m.title,
      destination: m.destination || '',
      country: m.country || '',
      image: img,
      subject,
      nights: m.nights, guests: m.guests,
      room: (m.room_type || '').trim(), meal: (m.meal_plan || '').trim(),
      flightIncluded: !!m.flight_included,
      rating: m.rating || null,
      luxury: !!m.luxury,
      dates: m.dates || '',
      description: descriptionFrom(body, m),
      booking,
      registryStatus: m.registry_status || (rp ? 'OK' : null),
      marketPrice: market, ourPrice: ours, save: market - ours,
      marketPriceLabel: fmtRub(market), ourPriceLabel: fmtRub(ours), saveLabel: fmtRub(market - ours),
      discountPercent: m.discount_percent ?? Math.round((1 - ours / market) * 100),
      budget: budgetBucket(ours),
      telegram: tgManagerText(m.title),     // ← ссылка на Telegram для этого оффера
      whatsapp: waText(m.title),
    })
  }
  return { date, offers }
}

const real = fromRealData()
const offers = real?.offers || []
const countries = [...new Set(offers.map((o) => o.country).filter(Boolean))].sort()
const budgets = ['до 100к', '100–200к', '200–300к', '300к+'].filter((b) => offers.some((o) => o.budget === b))

// Safety: on a build machine WITHOUT ../travel_posts (e.g. Vercel), do NOT
// overwrite the committed offers.json with an empty payload — keep the data
// that was generated + committed locally via sync_site.sh.
if (offers.length === 0 && fs.existsSync(OUT_JSON)) {
  try {
    const prev = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'))
    if ((prev.offers || []).length > 0) {
      console.log(`[gen-offers] travel_posts недоступен — сохраняю закоммиченные данные (${prev.offers.length} офферов). OK для Vercel.`)
      process.exit(0)
    }
  } catch { /* fall through to write */ }
}

const payload = {
  source: real ? 'travel_posts+registry' : 'empty',
  batchDate: real?.date || null,
  generatedAt: new Date().toISOString().slice(0, 10),
  channel: `https://t.me/${TG_CHANNEL}`,
  manager: `https://t.me/${TG_MANAGER}`,
  whatsapp: WHATSAPP_PHONE ? `https://wa.me/${WHATSAPP_PHONE}` : null,
  countries, budgets,
  offers,
}
fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2))
console.log(`[gen-offers] batch=${payload.batchDate} offers=${offers.length} countries=${countries.length} -> ${path.relative(ROOT, OUT_JSON)}`)
