import { TG_CHANNEL, TG_MANAGER } from '../links'
import { TelegramIcon, ArrowRight } from './icons'

type Variant = 'primary' | 'secondary' | 'light'
type Target = 'channel' | 'manager'

const styles: Record<Variant, string> = {
  primary:
    'bg-coral text-white shadow-[0_8px_24px_-8px_rgba(255,107,94,.7)] hover:bg-coral-400 hover:shadow-[0_12px_30px_-8px_rgba(255,107,94,.7)]',
  secondary:
    'bg-surface text-ink border border-line hover:border-turq hover:text-turq',
  light:
    'bg-white/12 text-white border border-white/25 backdrop-blur hover:bg-white/20',
}

export default function TelegramButton({
  target = 'channel',
  variant = 'primary',
  children,
  className = '',
  withArrow = false,
}: {
  target?: Target
  variant?: Variant
  children: React.ReactNode
  className?: string
  withArrow?: boolean
}) {
  const href = target === 'channel' ? TG_CHANNEL : TG_MANAGER
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-semibold transition-all duration-300 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turq ${styles[variant]} ${className}`}
    >
      <TelegramIcon className="h-5 w-5" />
      <span>{children}</span>
      {withArrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </a>
  )
}
