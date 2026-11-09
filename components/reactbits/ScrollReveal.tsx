'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  distance?: number
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 18,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
