import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TG_MANAGER } from '../links'
import { TelegramIcon } from './icons'
import ThemeToggle from './ThemeToggle'
import { easeOut } from '../lib/motion'

const navLinks: [string, string][] = [
  ['Каталог', '/#catalog'],
  ['Как работает', '/#how-it-works'],
  ['Отзывы', '/#reviews'],
  ['FAQ', '/#faq'],
  ['Заявка', '/#lead-form'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className={`container-x mt-3 flex h-16 items-center justify-between rounded-2xl px-4 transition-all duration-500 ${scrolled || open ? 'glass' : ''}`}>
          <a href="/" className="font-display text-lg font-bold tracking-tight text-ink" onClick={() => setOpen(false)}>
            Куда летим<span className="text-coral">?</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={TG_MANAGER}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold btn-grad transition sm:inline-flex"
            >
              <TelegramIcon className="h-4 w-4" /> Менеджер
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={open}
              className="glass grid h-10 w-10 place-items-center rounded-full text-ink lg:hidden"
            >
              <div className="relative h-4 w-5">
                <span className={`absolute left-0 block h-[2px] w-5 bg-current transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-1/2 block h-[2px] w-5 -translate-y-1/2 bg-current transition-all duration-200 ${open ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 block h-[2px] w-5 bg-current transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile full-screen menu — a product of its own */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'color-mix(in oklab, var(--color-bg) 80%, transparent)', backdropFilter: 'blur(24px)' }}
          >
            <nav className="flex h-full flex-col justify-center gap-2 px-8">
              {navLinks.map(([label, href], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, ease: easeOut, duration: 0.5 }}
                  className="font-display text-4xl font-semibold tracking-tight text-ink"
                >
                  {label}
                </motion.a>
              ))}
              <motion.a
                href={TG_MANAGER}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ease: easeOut, duration: 0.5 }}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-lg font-semibold btn-grad"
              >
                <TelegramIcon className="h-5 w-5" /> Написать менеджеру
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
