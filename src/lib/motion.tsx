import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export const easeOut = [0.16, 1, 0.3, 1] as const

/** Fade + rise on enter-viewport. Pass delay or use within Stagger. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}) {
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  return (
    <M
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, ease: easeOut, delay }}
      className={className}
    >
      {children}
    </M>
  )
}

/** Staggered container — children animate in sequence as the group enters view. */
export function Stagger({
  children,
  className = '',
  gap = 0.08,
}: {
  children: ReactNode
  className?: string
  gap?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', y = 30 }: { children: ReactNode; className?: string; y?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      variants={{ hidden: reduce ? {} : { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
