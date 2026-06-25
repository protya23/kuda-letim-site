import { Reveal, Stagger, StaggerItem } from '../lib/motion'

const items = [
  ['−50% и больше', 'Закрытые партнёрские тарифы и бонусные программы отелей — цены ниже публичных.'],
  ['Только проверенные отели', 'Каждый отель и фото проходят проверку — в подборке нет случайных предложений.'],
  ['Онлайн без офиса', 'Работаем онлайн с 2020 года. Нет аренды и посредников — экономию отдаём вам.'],
  ['Цена перед оплатой', 'Стоимость всегда подтверждается до оплаты. Никаких скрытых списаний.'],
  ['Подбор под бюджет', 'Скажете направление, даты и бюджет — соберём лучший вариант.'],
  ['Связь в Telegram', 'Быстрые ответы и бронирование прямо в мессенджере.'],
]

export default function Advantages() {
  return (
    <div className="container-x">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Почему мы</p>
        <h2 className="mt-3 font-display font-semibold text-ink" style={{ fontSize: 'var(--fs-h2)' }}>
          Премиум-отдых <span className="text-gradient">дешевле</span>
        </h2>
      </Reveal>
      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([t, d]) => (
          <StaggerItem key={t}>
            <div className="ring-grad glass h-full rounded-2xl p-7 [box-shadow:var(--shadow-card)]">
              <h3 className="font-display text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
