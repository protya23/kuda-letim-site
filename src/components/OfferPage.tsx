import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import data from '../data/offers.json'
import type { Offer } from './OfferCard'
import { useSeo } from '../lib/useSeo'
import { track } from '../lib/analytics'
import { TelegramIcon, Plane, Star, ArrowRight } from './icons'

const SITE_URL = (import.meta.env.VITE_SITE_URL as string) || ''
const abs = (p: string | null) => (p ? (SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')) + p : '')

export default function OfferPage() {
  const { id } = useParams()
  const offer = (data.offers as Offer[]).find((o) => o.id === id)

  const title = offer
    ? `${offer.title}, ${offer.country} — ${offer.ourPriceLabel} (−${offer.discountPercent}%) | Куда летим?`
    : 'Предложение не найдено | Куда летим?'
  const description = offer
    ? `${offer.title} (${offer.country}): обычная цена ${offer.marketPriceLabel}, для клиентов ${offer.ourPriceLabel}, экономия ${offer.saveLabel}. ${offer.description}`
    : 'Предложение не найдено.'
  useSeo({ title, description, image: abs(offer?.image || null), url: SITE_URL ? `${SITE_URL}/offer/${id}` : '' })

  useEffect(() => { if (offer) track('view_offer', { id: offer.id, hotel: offer.title, page: true }) }, [offer])

  if (!offer) {
    return (
      <div className="container-x py-40 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Предложение не найдено</h1>
        <Link to="/#catalog" className="mt-6 inline-flex btn-grad rounded-full px-6 py-3 font-semibold">← В каталог</Link>
      </div>
    )
  }

  return (
    <div className="container-x py-28 sm:py-32">
      <Link to="/#catalog" className="text-sm font-medium text-muted transition hover:text-ink">← Все предложения</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* gallery */}
        <div className="ring-grad relative overflow-hidden rounded-[1.8rem]">
          {offer.image ? (
            <img src={offer.image} alt={`${offer.title}, ${offer.country}`} className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="grid aspect-[4/3] w-full place-items-center bg-gradient-to-br from-violet to-blue"><span className="font-display text-3xl text-white/90">{offer.country}</span></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full px-3 py-1.5 text-sm font-bold text-[#1a0f0c] btn-grad">−{offer.discountPercent}%</div>
          {offer.rating && <div className="glass absolute right-5 top-5 flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold text-white"><Star className="h-3.5 w-3.5 text-gold" /> {Number(offer.rating).toFixed(1)}</div>}
        </div>

        {/* info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">{offer.country}{offer.luxury ? ' · Luxury' : ''}{offer.subject ? ` · ${offer.subject}` : ''}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{offer.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{offer.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            {[['Страна', offer.country], ['Даты', offer.dates], ['Ночей', String(offer.nights)]].map(([k, v]) => (
              <div key={k}><dt className="text-xs uppercase tracking-wide text-muted">{k}</dt><dd className="mt-0.5 font-medium text-ink">{v}</dd></div>
            ))}
            <div><dt className="text-xs uppercase tracking-wide text-muted">Перелёт</dt><dd className="mt-0.5 inline-flex items-center gap-1 font-medium text-ink">{offer.flightIncluded ? <><Plane className="h-4 w-4 text-teal" /> включён</> : 'отдельно'}</dd></div>
          </dl>
          {offer.room && <p className="mt-3 text-sm text-muted">{offer.room}{offer.meal ? ` · ${offer.meal}` : ''} · {offer.guests} гостя</p>}

          <div className="ring-grad mt-6 grid gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--card-bg)] p-5 sm:grid-cols-3">
            <div><p className="text-xs uppercase tracking-wide text-muted">Обычная цена</p><p className="mt-1 text-lg font-medium text-muted line-through">{offer.marketPriceLabel}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-teal">Цена для клиентов</p><p className="mt-1 font-display text-2xl font-bold text-ink">{offer.ourPriceLabel}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-muted">Экономия</p><p className="mt-1 text-lg font-bold text-gradient-warm">{offer.saveLabel}</p></div>
          </div>

          <a href={offer.telegram} target="_blank" rel="noopener noreferrer"
            onClick={() => track('click_telegram', { id: offer.id, hotel: offer.title, where: 'offer_page' })}
            className="group mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold btn-grad transition">
            <TelegramIcon className="h-5 w-5" /> Проверить цену в Telegram
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          {offer.booking && (
            <p className="mt-4 text-center text-sm">
              <a href={offer.booking} target="_blank" rel="noopener noreferrer"
                onClick={() => track('click_booking', { id: offer.id, hotel: offer.title })}
                className="font-medium text-ink underline decoration-[var(--color-line)] underline-offset-4 transition hover:text-teal">
                Посмотреть отель и фото на Booking
              </a>
              <span className="mt-1 block text-xs text-muted">только для просмотра — бронь и цена через Telegram</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
