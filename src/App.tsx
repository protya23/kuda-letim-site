import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import OfferPage from './components/OfferPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  return null
}
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import Advantages from './components/Advantages'
import Reviews from './components/Reviews'
import LeadForm from './components/LeadForm'
import Faq from './components/Faq'
import Aurora from './components/Aurora'
import { Reveal, Stagger, StaggerItem } from './lib/motion'
import { TG_CHANNEL, TG_MANAGER, TG_MANAGER_USERNAME } from './links'
import { Check, ArrowRight, TelegramIcon } from './components/icons'

/* ---------- primitives ---------- */
function Section({ id, alt = false, className = '', children }: { id?: string; alt?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`relative py-24 sm:py-32 ${alt ? 'bg-[var(--color-bg2)]' : 'bg-[var(--color-bg)]'} ${className}`}>
      {children}
    </section>
  )
}
const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">{children}</p>
)
const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-display font-semibold text-ink ${className}`} style={{ fontSize: 'var(--fs-h2)' }}>{children}</h2>
)
function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`ring-grad glass rounded-[1.4rem] [box-shadow:var(--shadow-card)] ${className}`}>{children}</div>
}

/* ---------- how we get prices ---------- */
function HowPrices() {
  const items = [
    ['Партнёрские тарифы', 'Прямые закрытые условия с отелями — цены ниже публичных на Booking и в классических агентствах.'],
    ['Бонусные программы отелей', 'Часть предложений приходит через бонусные и закрытые тарифы программ лояльности — их передают нам по сниженной цене.'],
    ['Перелёты на мили', 'Люди, накопившие мили, и участники бонусных программ продают нам мили дешевле рынка — поэтому перелёт выходит выгоднее.'],
    ['Онлайн без офиса', 'Мы полностью онлайн с 2020 года. Нет аренды и лишних посредников — экономию отдаём вам в цене.'],
    ['Заранее выкупленные возможности', 'Лучшие тарифы фиксируются заранее. Бронь за 30+ дней до поездки = выше шанс поймать сильную скидку.'],
    ['Ограниченное количество', 'Закрытые предложения всегда лимитированы по числу мест и срокам — поэтому они такие выгодные.'],
  ]
  return (
    <Section id="how-prices">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Честно о ценах</Eyebrow>
          <H2 className="mt-3">Как мы получаем <span className="text-gradient">такие цены</span></H2>
          <p className="mt-5 text-balance text-muted" style={{ fontSize: 'var(--fs-lead)' }}>
            Никакой магии и нарушений правил. Только закрытые партнёрские тарифы, бонусные программы и заранее выкупленные возможности.
          </p>
        </Reveal>
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([t, d], i) => (
            <StaggerItem key={t}>
              <GlassCard className="h-full p-7">
                <div className="grid h-11 w-11 place-items-center rounded-xl font-display text-sm font-bold text-[#1a0f0c] btn-grad">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

/* ---------- why early ---------- */
function WhyEarly() {
  const points = ['Лучшие закрытые тарифы появляются заранее', 'Больше выбор отелей и номеров', 'Легче собрать удобный перелёт', 'Выше шанс получить премиум по цене обычного отдыха']
  return (
    <Section id="why-early" alt className="overflow-hidden">
      <Aurora className="opacity-60" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Главное правило</Eyebrow>
          <H2 className="mt-3">Бронируйте <span className="text-gradient-warm">заранее</span></H2>
          <p className="mt-5 text-muted" style={{ fontSize: 'var(--fs-lead)' }}>
            Минимум за 1 месяц до поездки — так больше шансов поймать самую сильную скидку.
          </p>
          <div className="mt-8 flex items-center gap-5">
            <div className="font-display text-7xl font-bold text-gradient">30+</div>
            <p className="max-w-[14rem] text-sm text-muted">дней до вылета — оптимальное окно для лучших тарифов</p>
          </div>
        </Reveal>
        <Stagger className="grid gap-4">
          {points.map((p) => (
            <StaggerItem key={p}>
              <GlassCard className="flex items-start gap-4 p-5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#1a0f0c] btn-grad"><Check className="h-4 w-4" /></span>
                <span className="text-[15px] text-ink/90">{p}</span>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

/* ---------- how it works ---------- */
function HowItWorks() {
  const steps = [
    ['Смотрите предложения', 'Листаете актуальные отели и перелёты в Telegram-канале.'],
    ['Пишете в Telegram', 'Сообщаете менеджеру направление и желаемые даты.'],
    ['Проверяем доступность', 'Сверяем закрытые тарифы и наличие мест под ваши даты.'],
    ['Фиксируем цену', 'Подтверждаем актуальную стоимость — без списаний заранее.'],
    ['Получаете бронь', 'Вы получаете подтверждение и летите дешевле.'],
  ]
  return (
    <Section id="how-it-works">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Просто и прозрачно</Eyebrow>
          <H2 className="mt-3">Как это работает</H2>
        </Reveal>
        <Stagger className="mt-14 grid gap-5 md:grid-cols-5">
          {steps.map(([t, d], i) => (
            <StaggerItem key={t}>
              <GlassCard className="h-full p-6">
                <div className="font-display text-4xl font-bold text-gradient">{i + 1}</div>
                <h3 className="mt-2 font-display text-base font-semibold text-ink">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{d}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

/* ---------- trust ---------- */
function Trust() {
  const items = [
    ['Не «горящие туры»', 'Мы не распродаём остатки в последний момент — мы ищем закрытые возможности заранее.'],
    ['Цена — перед оплатой', 'Стоимость всегда подтверждается до оплаты. Никаких скрытых списаний.'],
    ['Места ограничены', 'Закрытые тарифы лимитированы — решение принимается, когда цена подтверждена.'],
    ['Всё согласуем заранее', 'Отель, даты, перелёт и условия — все детали проговариваем до бронирования.'],
  ]
  return (
    <Section id="trust" alt>
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Доверие и безопасность</Eyebrow>
          <H2 className="mt-3">Прозрачно на каждом шаге</H2>
        </Reveal>
        <Stagger className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          {items.map(([t, d]) => (
            <StaggerItem key={t}>
              <GlassCard className="flex h-full gap-4 p-6">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#1a0f0c] btn-grad"><Check className="h-5 w-5" /></span>
                <div><h3 className="font-display text-lg font-semibold text-ink">{t}</h3><p className="mt-1 text-[15px] leading-relaxed text-muted">{d}</p></div>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

/* ---------- for whom ---------- */
function ForWhom() {
  const who = [
    ['Семьям', 'Просторные номера и отели для отдыха с детьми — по цене ниже обычной.'],
    ['Парам', 'Романтические направления и премиум-отели для двоих.'],
    ['Тем, кто планирует заранее', 'Если вы готовы бронировать за месяц — мы поймаем для вас лучший тариф.'],
    ['Любителям премиума', 'Отели 5★ и luxury-курорты по цене обычного отдыха.'],
    ['Тем, кто решает быстро', 'Если цена подтвердилась — быстрое решение фиксирует выгоду.'],
  ]
  return (
    <Section id="for-whom">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Кому подходит</Eyebrow>
          <H2 className="mt-3">Для кого это</H2>
        </Reveal>
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {who.map(([t, d]) => (
            <StaggerItem key={t}>
              <GlassCard className="h-full p-7">
                <h3 className="font-display text-xl font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

/* ---------- final CTA ---------- */
function FinalCta() {
  return (
    <Section id="cta" alt>
      <div className="container-x">
        <Reveal>
          <div className="ring-grad glass relative overflow-hidden rounded-[2.2rem] px-6 py-20 text-center sm:px-12 sm:py-28">
            <Aurora />
            <div className="relative mx-auto max-w-3xl">
              <H2 className="!text-[clamp(2.2rem,6vw,5rem)]">Посмотрите, куда можно улететь <span className="text-gradient">дешевле</span></H2>
              <p className="mx-auto mt-6 max-w-xl text-muted" style={{ fontSize: 'var(--fs-lead)' }}>
                Закрытые предложения обновляются каждый день. Бронируйте заранее — и летите выгоднее.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={TG_CHANNEL} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold btn-grad transition">
                  <TelegramIcon className="h-5 w-5" /> Telegram-канал
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href={TG_MANAGER} target="_blank" rel="noopener noreferrer"
                  className="glass inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-ink transition hover:scale-[1.02]">
                  <TelegramIcon className="h-5 w-5" /> Написать менеджеру
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/* ---------- footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-bg)]">
      <div className="container-x flex flex-col items-center gap-6 py-14 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-xl font-bold text-ink">Куда летим<span className="text-coral">?</span></p>
          <p className="mt-1 text-sm text-muted">Онлайн travel-сервис закрытых предложений · с 2020 года</p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <div className="flex gap-3">
            <a href={TG_CHANNEL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold btn-grad transition">
              <TelegramIcon className="h-4 w-4" /> Канал
            </a>
            <a href={TG_MANAGER} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-ink transition hover:scale-[1.02]">
              <TelegramIcon className="h-4 w-4" /> @{TG_MANAGER_USERNAME}
            </a>
          </div>
          <p className="text-xs text-muted">© 2026 Куда летим? · Все цены подтверждаются перед оплатой</p>
        </div>
      </div>
    </footer>
  )
}

function Home() {
  return (
    <main>
      <Hero />
      <Section id="advantages"><Advantages /></Section>
      <Section id="catalog" alt><Catalog /></Section>
      <HowPrices />
      <WhyEarly />
      <HowItWorks />
      <Trust />
      <ForWhom />
      <Section id="reviews" alt><Reviews /></Section>
      <Section id="faq">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>Вопросы и ответы</Eyebrow>
            <H2 className="mt-3">FAQ</H2>
          </Reveal>
          <div className="mt-14"><Faq /></div>
        </div>
      </Section>
      <Section id="lead-form" alt><LeadForm /></Section>
      <FinalCta />
    </main>
  )
}

export default function App() {
  return (
    <div className="grain">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offer/:id" element={<main><OfferPage /></main>} />
      </Routes>
      <Footer />
    </div>
  )
}
