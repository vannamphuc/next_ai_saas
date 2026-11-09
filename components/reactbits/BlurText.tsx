'use client'

import { motion, useReducedMotion } from 'motion/react'

type BlurTextProps = {
  text: string
  animateBy?: 'words' | 'characters'
  trigger?: 'load'
  effect?: 'blur'
  delay?: number
  stepDuration?: number
  className?: string
}

export default function BlurText({
  text,
  animateBy = 'words',
  trigger = 'load',
  effect = 'blur',
  delay = 120,
  stepDuration = 0.4,
  className,
}: BlurTextProps) {
  const shouldReduceMotion = useReducedMotion()
  const segments =
    animateBy === 'words' ? text.split(/(\s+)/) : Array.from(text)

  return (
    <motion.h1
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={trigger === 'load' ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: delay / 1000,
          },
        },
      }}
      className={className}
    >
      <span aria-hidden="true" className="block">
        {segments.map((segment, index) => {
          if (animateBy === 'words' && segment.trim() === '') {
            return <span key={`space-${index}`}>{segment}</span>
          }

          return (
            <motion.span
              key={`${segment}-${index}`}
              className="inline-block whitespace-pre"
              variants={{
                hidden: {
                  opacity: 0,
                  filter: effect === 'blur' ? 'blur(12px)' : 'none',
                  y: 6,
                },
                visible: {
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  transition: {
                    duration: stepDuration,
                    ease: 'easeOut',
                  },
                },
              }}
            >
              {segment}
            </motion.span>
          )
        })}
      </span>
      <span className="sr-only">{text}</span>
    </motion.h1>
  )
}
