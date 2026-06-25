import { motion, useReducedMotion } from 'framer-motion'

/** Cinematic animated gradient blobs (Stripe/Linear-grade ambient light). */
export default function Aurora({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const float = (d: number) =>
    reduce
      ? {}
      : { animate: { x: [0, 30, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.1, 0.95, 1] }, transition: { duration: d, repeat: Infinity, ease: 'easeInOut' } }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <motion.div {...float(18)} className="absolute -left-32 -top-40 h-[42rem] w-[42rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(139,123,255,.55), transparent 60%)' }} />
      <motion.div {...float(22)} className="absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(45,212,196,.45), transparent 60%)' }} />
      <motion.div {...float(26)} className="absolute bottom-[-12rem] left-1/3 h-[38rem] w-[38rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(255,111,97,.42), transparent 60%)' }} />
      {/* fine dotted grid for depth */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
    </div>
  )
}
