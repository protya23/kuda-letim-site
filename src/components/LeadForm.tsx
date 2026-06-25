import { useState } from 'react'
import data from '../data/offers.json'
import { track } from '../lib/analytics'
import { TelegramIcon, ArrowRight, Check } from './icons'

const MANAGER = (data as { manager?: string }).manager || 'https://t.me/traveI_j'

export default function LeadForm({ offerId = null, hotel = '' }: { offerId?: string | null; hotel?: string }) {
  const [sent, setSent] = useState(false)
  const countries = ['Не важно', ...((data.countries as string[]) || [])]
  const budgets = ['Не важно', ...((data.budgets as string[]) || [])]

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const lead = {
      name: String(f.get('name') || '').trim(),
      contact: String(f.get('contact') || '').trim(),
      dest: String(f.get('dest') || ''),
      budget: String(f.get('budget') || ''),
      dates: String(f.get('dates') || '').trim(),
      comment: String(f.get('comment') || '').trim(),
      offer_id: offerId,
      hotel,
    }
    track('submit_lead', { dest: lead.dest, budget: lead.budget, offer_id: offerId })

    // 1) сохранить лид (serverless /api/lead → leads.json + опц. Telegram админу)
    try {
      await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, ts: new Date().toISOString(), source: 'website' }),
      })
    } catch { /* offline / no backend — Telegram deep-link ниже всё равно сработает */ }

    // 2) открыть Telegram с подставленным текстом (надёжный путь к менеджеру)
    const msg =
      `Заявка с сайта «Куда летим?»\n` +
      (hotel ? `Отель: ${hotel}\n` : '') +
      `Имя: ${lead.name || '—'}\nКонтакт: ${lead.contact || '—'}\n` +
      `Направление: ${lead.dest}\nБюджет: ${lead.budget}\n` +
      (lead.dates ? `Даты: ${lead.dates}\n` : '') +
      (lead.comment ? `Комментарий: ${lead.comment}\n` : '')
    window.open(`${MANAGER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    setSent(true)
  }

  const field = 'w-full rounded-xl border border-[var(--color-line)] bg-[var(--glass-bg)] px-4 py-3 text-ink backdrop-blur placeholder:text-muted focus:border-teal focus:outline-none'

  return (
    <div id="lead" className="container-x">
      <div className="ring-grad glass mx-auto max-w-3xl rounded-[1.8rem] p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Заявка на подбор</p>
        <h2 className="mt-3 font-display font-semibold text-ink" style={{ fontSize: 'var(--fs-h3)' }}>
          {hotel ? `Запросить цену: ${hotel}` : 'Подберём тур под ваш бюджет и даты'}
        </h2>

        {sent ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-teal/40 bg-teal/10 p-6 text-ink">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#1a0f0c] btn-grad"><Check className="h-5 w-5" /></span>
            <div>
              <p className="font-semibold">Заявка принята — открыли Telegram.</p>
              <p className="text-sm text-muted">Если чат не открылся — <a href={MANAGER} target="_blank" rel="noopener noreferrer" className="text-teal underline">напишите менеджеру</a>.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-ink">Имя</span>
              <input name="name" placeholder="Как к вам обращаться" className={field} /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-ink">Telegram / телефон</span>
              <input name="contact" placeholder="@username или +7…" className={field} /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-ink">Направление</span>
              <select name="dest" defaultValue={hotel ? 'Не важно' : undefined} className={field}>{countries.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-ink">Бюджет</span>
              <select name="budget" className={field}>{budgets.map((b) => <option key={b}>{b}</option>)}</select></label>
            <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-ink">Желаемые даты (необязательно)</span>
              <input name="dates" placeholder="например, июль, 7–10 ночей" className={field} /></label>
            <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-ink">Комментарий (необязательно)</span>
              <textarea name="comment" rows={2} placeholder="Пожелания по отелю, составу, питанию…" className={field} /></label>
            <button type="submit" className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold btn-grad transition sm:col-span-2">
              <TelegramIcon className="h-5 w-5" /> Отправить заявку
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-xs text-muted sm:col-span-2">Бронирование и оплата — только после подтверждения цены менеджером.</p>
          </form>
        )}
      </div>
    </div>
  )
}
