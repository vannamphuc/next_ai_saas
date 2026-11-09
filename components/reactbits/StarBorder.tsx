'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useTheme } from 'next-themes'
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

type StarBorderOwnProps<C extends ElementType> = {
  as?: C
  color?: string
  duration?: number
  className?: string
  children: ReactNode
}

type StarBorderProps<C extends ElementType> = StarBorderOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof StarBorderOwnProps<C>>

export default function StarBorder<C extends ElementType = 'button'>({
  as,
  color = '#C76A1A',
  duration = 4,
  className,
  children,
  style,
  ...elementProps
}: StarBorderProps<C>) {
  const Component = as ?? 'button'
  const { resolvedTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const activeColor = resolvedTheme === 'dark' ? '#E8B44A' : color

  return (
    <Component
      {...(Component === 'button' ? { type: 'button' } : {})}
      {...elementProps}
      className={cn(
        'group/star-border relative isolate inline-flex cursor-pointer overflow-hidden rounded-xl p-px text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      style={
        {
          ...style,
          '--star-border-color': activeColor,
        } as CSSProperties
      }
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, transparent 36deg, var(--star-border-color) 54deg, transparent 74deg, transparent 360deg)',
        }}
        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration, repeat: Infinity, ease: 'linear' }
        }
      />
      <motion.span
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        className={cn(
          'relative z-10 inline-flex items-center justify-center gap-2 rounded-[inherit] bg-primary px-5 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90',
          className,
        )}
      >
        {children}
      </motion.span>
    </Component>
  )
}
