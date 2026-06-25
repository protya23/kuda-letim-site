import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, Star, ArrowRight, TelegramIcon } from './icons'
import { track } from '../lib/analytics'

export type Offer = {
  id: string
  title: string
  destination: string
  country: string
  image: string | null
  subject: string | null
  nights: number
  guests: number
  room: string
  meal: string
  flightIncluded: boolean
  rating: number | null
  luxury: boolean
  dates: string
  description: string
  booking: string | null
  registryStatus: string | null
  marketPrice: number
  ourPrice: number
  save: number
  marketPriceLabel: string
  ourPriceLabel: string
  saveLabel: string
  discountPercent: number
  budget: string
  telegram: string
  whatsapp: string | null
}

const gradients = [
  'from-violet to-blue', 'from-coral to-gold', 'from-teal to-blue',
  'from-blue to-violet', 'from-gold to-coral', 'from-teal to-violet',
]

export default function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const open = () => navigate(`/offer/${offer.id}`)
  // offer impression tracking (once in viewport)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { track('view_offer', { id: offer.id, hotel: offer.title }); io.disconnect() }
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [offer.id, offer.title])

  return (
    <motion.article
      ref={ref}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
      role="link"
      tabIndex={0}
      aria-label={`Открыть предложение: ${offer.title}, ${offer.destination}`}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="ring-grad group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.6rem] bg-[var(--card-bg)] [box-shadow:var(--shadow-card)] backdrop-blur-xl transition-shadow hover:[box-shadow:var(--shadow-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {offer.image ? (
          <img src={offer.image} alt={`${offer.title}, ${offer.destination}`} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110" />
        ) : (
          <div className={`flex h-full w-full items-end bg-gradient-to-br ${gradients[index % gradients.length]} p-5`}>
            <span className="font-display text-2xl font-semibold text-white/90">{offer.destination || offer.country}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-3.5 top-3.5 rounded-full px-3 py-1.5 text-sm font-bold text-[#1a0f0c] btn-grad">−{offer.discountPercent}%</div>
        {offer.luxury && (
          <div className="glass absolute right-3.5 top-3.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">Luxury</div>
        )}
        {offer.rating && (
          <div className="glass absolute bottom-3.5 right-3.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold text-white">
            <Star className="h-3.5 w-3.5 text-gold" /> {Number(offer.rating).toFixed(1)}
          </div>
        )}
        <div className="absolute bottom-3.5 left-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">{offer.country}</p>
          <h3 className="font-display text-lg font-semibold text-white drop-shadow">{offer.destination || offer.country}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[17px] font-semibold text-ink">{offer.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{offer.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span>{offer.nights} ночей</span><span className="opacity-40">·</span><span>{offer.guests} гостя</span>
          {offer.flightIncluded && <span className="inline-flex items-center gap-1 text-ink/90"><Plane className="h-4 w-4 text-teal" /> перелёт</span>}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-[var(--color-line)] pt-4">
          <div>
            <p className="text-sm text-muted line-through">{offer.marketPriceLabel}</p>
            <p className="font-display text-2xl font-bold text-ink">{offer.ourPriceLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-teal">экономия</p>
            <p className="text-sm font-bold text-teal">{offer.saveLabel}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--glass-bg)] px-3 py-3 text-sm font-semibold text-ink backdrop-blur transition-colors group-hover:border-violet/50">
            Подробнее <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <a href={offer.telegram} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); track('click_telegram', { id: offer.id, hotel: offer.title, where: 'card' }) }}
            aria-label="Забронировать в Telegram"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold btn-grad">
            <TelegramIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  )
}
