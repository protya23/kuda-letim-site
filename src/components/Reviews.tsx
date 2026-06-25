import { Reveal, Stagger, StaggerItem } from '../lib/motion'
import { Star } from './icons'

const reviews = [
  ['Анна', 'Мальдивы, Four Seasons', 'Сначала не поверила в цену — но всё подтвердилось. Отель и перелёт обошлись почти вдвое дешевле, чем на Booking.'],
  ['Дмитрий', 'Дубай', 'Бронировали за месяц, поймали отличную скидку. Менеджер всё проверил до оплаты, никаких сюрпризов.'],
  ['Марина и Сергей', 'Бали', 'Медовый месяц мечты по цене обычного отпуска. Подобрали виллу с видом — спасибо!'],
  ['Игорь', 'Турция, Бодрум', 'Удобно, что всё в Telegram. Ответили быстро, цену зафиксировали, отдохнули супер.'],
]

export default function Reviews() {
  return (
    <div className="container-x">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Отзывы</p>
        <h2 className="mt-3 font-display font-semibold text-ink" style={{ fontSize: 'var(--fs-h2)' }}>Нам доверяют</h2>
      </Reveal>
      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
        {reviews.map(([name, trip, text]) => (
          <StaggerItem key={name}>
            <figure className="ring-grad glass h-full rounded-2xl p-7 [box-shadow:var(--shadow-card)]">
              <div className="mb-3 flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4" />)}</div>
              <blockquote className="text-[15px] leading-relaxed text-ink/90">«{text}»</blockquote>
              <figcaption className="mt-4 text-sm"><span className="font-semibold text-ink">{name}</span> <span className="text-muted">· {trip}</span></figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
