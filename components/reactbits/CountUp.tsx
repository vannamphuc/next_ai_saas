'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  end: number
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
}

export default function CountUp({
  end,
  prefix = '',
  suffix = '',
  decimals = 0,
  label,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element || isVisible) return

    if (shouldReduceMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible, shouldReduceMotion])

  useEffect(() => {
    if (!isVisible) return

    if (shouldReduceMotion) {
      setValue(end)
      return
    }

    const duration = 1400
    let frame = 0
    let startTime: number | undefined
    const scale = 10 ** decimals

    const update = (time: number) => {
      startTime ??= time
      const progress = Math.min((time - startTime) / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      setValue(Math.round(end * easedProgress * scale) / scale)

      if (progress < 1) frame = window.requestAnimationFrame(update)
    }

    frame = window.requestAnimationFrame(update)
    return () => window.cancelAnimationFrame(frame)
  }, [decimals, end, isVisible, shouldReduceMotion])

  const formattedValue = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {prefix}
        {formattedValue}
        {suffix}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  )
}
