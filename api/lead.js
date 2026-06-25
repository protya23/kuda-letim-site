// Vercel serverless function: POST /api/lead  (Task 2 — lead capture).
// Saves the lead to leads.json + leads.csv AND (optionally) notifies an admin
// in Telegram. Uses SEPARATE env vars — it does NOT touch the content bot.
//   LEAD_TG_TOKEN  — a bot token allowed to message the admin (optional)
//   LEAD_TG_CHAT   — admin chat id to receive leads (optional)
// Fields: name, contact, dest, dates, budget, comment, offer_id, hotel, ts, source.
// NOTE: on Vercel the filesystem is ephemeral — Telegram delivery is the durable
// path; for permanent storage point LEAD_TG_* at your admin or wire a DB/Sheet.
import fs from 'node:fs'
import path from 'node:path'

const LEADS_JSON = path.join(process.cwd(), 'leads.json')
const LEADS_CSV = path.join(process.cwd(), 'leads.csv')
const FIELDS = ['ts', 'name', 'contact', 'dest', 'budget', 'dates', 'comment', 'offer_id', 'hotel', 'source']

function appendLocal(lead) {
  try {
    const arr = fs.existsSync(LEADS_JSON) ? JSON.parse(fs.readFileSync(LEADS_JSON, 'utf8')) : []
    arr.push(lead)
    fs.writeFileSync(LEADS_JSON, JSON.stringify(arr, null, 2))
    if (!fs.existsSync(LEADS_CSV)) fs.writeFileSync(LEADS_CSV, FIELDS.join(',') + '\n')
    const row = FIELDS.map((f) => `"${String(lead[f] ?? '').replace(/"/g, '""')}"`).join(',')
    fs.appendFileSync(LEADS_CSV, row + '\n')
    return true
  } catch { return false } // ephemeral/read-only FS on serverless — ok, TG is the durable path
}

async function notifyTelegram(lead) {
  const token = process.env.LEAD_TG_TOKEN, chat = process.env.LEAD_TG_CHAT
  if (!token || !chat) return false
  const text =
    `🆕 Заявка с сайта «Куда летим?»\n` +
    (lead.hotel ? `Отель: ${lead.hotel}\n` : '') +
    (lead.offer_id ? `offer_id: ${lead.offer_id}\n` : '') +
    `Имя: ${lead.name || '—'}\nКонтакт: ${lead.contact || '—'}\n` +
    `Направление: ${lead.dest || '—'}\nБюджет: ${lead.budget || '—'}\n` +
    (lead.dates ? `Даты: ${lead.dates}\n` : '') +
    (lead.comment ? `Комментарий: ${lead.comment}\n` : '')
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text }),
    })
    return r.ok
  } catch { return false }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'method' }); return }
  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const lead = {
    ts: body?.ts || new Date().toISOString(),
    name: body?.name || '', contact: body?.contact || '', dest: body?.dest || '',
    budget: body?.budget || '', dates: body?.dates || '', comment: body?.comment || '',
    offer_id: body?.offer_id || '', hotel: body?.hotel || '', source: body?.source || 'website',
  }
  const saved = appendLocal(lead)
  const notified = await notifyTelegram(lead)
  res.status(200).json({ ok: true, saved, notified })
}
