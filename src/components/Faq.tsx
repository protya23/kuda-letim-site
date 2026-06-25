import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { easeOut } from '../lib/motion'

const faqs = [
  { q: 'Почему так дёшево?', a: 'Мы работаем онлайн без офиса и используем закрытые партнёрские тарифы, бонусные программы отелей и заранее выкупленные возможности. Меньше посредников и накладных расходов — ниже цена для вас.' },
  { q: 'Это легально?', a: 'Да. Мы пользуемся официальными партнёрскими и бонусными программами и заранее зарезервированными тарифами. Мы не нарушаем правила отелей и авиакомпаний — мы лишь получаем доступ к закрытым предложениям и передаём выгоду вам.' },
  { q: 'Почему нужно бронировать заранее?', a: 'Лучшие закрытые тарифы и наличие мест появляются заранее. За 30+ дней до поездки больше выбор отелей, проще собрать удобный перелёт и выше шанс получить премиум по цене обычного отдыха.' },
  { q: 'Можно ли выбрать свои даты?', a: 'Да. Вы говорите желаемые даты и направление, мы проверяем доступность закрытых тарифов под них. Чем гибче даты — тем выше шанс поймать сильную скидку.' },
  { q: 'Есть ли офис?', a: 'Нет. Мы полностью онлайн с 2020 года. Именно поэтому держим цены ниже классических агентств. Все вопросы решаем в Telegram.' },
  { q: 'Как проходит оплата?', a: 'Сначала мы подтверждаем актуальную цену и доступность. Оплата происходит только после согласования всех деталей — никаких списаний до подтверждения брони.' },
  { q: 'Что если цена изменилась?', a: 'Цена всегда подтверждается перед оплатой. Если тариф изменился или место уже выкупили, мы честно сообщим об этом и предложим альтернативу — вы ничего не теряете.' },
  { q: 'Можно ли просто посмотреть отель на Booking?', a: 'Конечно. Мы даём название отеля и даты — вы можете сверить отель и обычную цену на Booking, а затем сравнить с нашим закрытым тарифом.' },
]

function Item({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <button onClick={onToggle} aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet">
        <span className="font-display text-lg font-semibold text-ink">{q}</span>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-teal transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}>
            <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto grid max-w-3xl gap-3">
      {faqs.map((f, i) => (
        <Item key={f.q} {...f} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
      ))}
    </div>
  )
}
