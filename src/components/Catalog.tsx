import { useMemo, useState } from 'react'
import data from '../data/offers.json'
import OfferCard, { type Offer } from './OfferCard'
import { Reveal, Stagger, StaggerItem } from '../lib/motion'
import { track } from '../lib/analytics'

const ALL = 'Все'

export default function Catalog() {
  const offers = data.offers as Offer[]
  const countries: string[] = [ALL, ...((data.countries as string[]) || [])]
  const budgets: string[] = [ALL, ...((data.budgets as string[]) || [])]
  const live = data.source !== 'empty'

  const [country, setCountry] = useState(ALL)
  const [budget, setBudget] = useState(ALL)

  const filtered = useMemo(
    () => offers.filter((o) => (country === ALL || o.country === country) && (budget === ALL || o.budget === budget)),
    [offers, country, budget],
  )

  const chip = (val: string, cur: string, set: (v: string) => void, kind: string) => (
    <button
      key={val}
      onClick={() => { set(val); track('filter_change', { kind, value: val }) }}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        cur === val ? 'btn-grad text-[#1a0f0c]' : 'glass text-ink hover:scale-[1.03]'
      }`}
    >
      {val}
    </button>
  )

  return (
    <div className="container-x">
      <Reveal className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Каталог предложений</p>
          <h2 className="mt-3 max-w-2xl font-display font-semibold text-ink" style={{ fontSize: 'var(--fs-h2)' }}>
            Куда улететь дешевле <span className="text-gradient">прямо сейчас</span>
          </h2>
        </div>
        <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-muted">
          <span className={`h-2 w-2 rounded-full ${live ? 'bg-teal' : 'bg-gold'}`} />
          {live ? `${offers.length} предложений · из Telegram` : 'Нет данных'} · обновлено {data.generatedAt}
        </span>
      </Reveal>

      {/* filters */}
      <Reveal className="mt-8 space-y-3" delay={0.05}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">Страна</span>
          {countries.map((c) => chip(c, country, setCountry, 'country'))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">Бюджет</span>
          {budgets.map((b) => chip(b, budget, setBudget, 'budget'))}
        </div>
      </Reveal>

      <p className="mt-6 text-sm text-muted">Найдено: <span className="font-semibold text-ink">{filtered.length}</span></p>

      <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" key={`${country}-${budget}`}>
        {filtered.map((o, i) => (
          <StaggerItem key={o.id}>
            <OfferCard offer={o} index={i} />
          </StaggerItem>
        ))}
      </Stagger>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted">Под выбранные фильтры предложений нет — измените страну или бюджет.</p>
      )}
    </div>
  )
}
