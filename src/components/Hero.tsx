import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Aurora from './Aurora'
import { TG_CHANNEL, TG_MANAGER } from '../links'
import { TelegramIcon, ArrowRight } from './icons'
import { easeOut } from '../lib/motion'

const badges = ['Онлайн с 2020', 'Отели + перелёты', 'Скидки до 70%', 'Бронь заранее от 30 дней']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120])
  const yAurora = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  }
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOut } },
  }

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-bg">
      <motion.div style={{ y: yAurora }} className="absolute inset-0">
        <Aurora />
      </motion.div>
      {/* fade to page bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      <motion.div style={{ y: yText, opacity }} className="container-x relative z-10 pt-24">
        <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-5xl text-center">
          <motion.div variants={item} className="mb-7 flex justify-center">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
              </span>
              Закрытый travel-сервис · новые цены каждый день
            </span>
          </motion.div>

          <motion.h1 variants={item} className="font-display font-bold text-ink" style={{ fontSize: 'var(--fs-hero)' }}>
            Путешествия
            <br />
            <span className="text-gradient">дешевле до 70%</span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-7 max-w-xl text-balance text-muted" style={{ fontSize: 'var(--fs-lead)' }}>
            Закрытые предложения на отели и перелёты — для тех, кто готов бронировать заранее.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={TG_CHANNEL} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold btn-grad transition">
              <TelegramIcon className="h-5 w-5" /> Смотреть предложения
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={TG_MANAGER} target="_blank" rel="noopener noreferrer"
              className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-ink transition hover:scale-[1.02]">
              <TelegramIcon className="h-5 w-5" /> Написать менеджеру
            </a>
          </motion.div>

          <motion.ul variants={item} className="mt-14 flex flex-wrap items-center justify-center gap-2.5">
            {badges.map((b) => (
              <li key={b} className="glass rounded-full px-4 py-2 text-sm font-medium text-ink/85">{b}</li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="glass flex h-10 w-6 items-start justify-center rounded-full p-1.5">
          <motion.span animate={reduce ? {} : { y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-2 w-1 rounded-full bg-ink/70" />
        </div>
      </motion.div>
    </section>
  )
}
