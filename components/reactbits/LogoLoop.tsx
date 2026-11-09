'use client'

import Image, { type StaticImageData } from 'next/image'
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from 'react'

export type LogoLoopItem = {
  src: string | StaticImageData
  alt: string
  width?: number
  height?: number
  className?: string
}

type LogoLoopProps = {
  logos: LogoLoopItem[]
  speed?: number
  logoHeight?: number
  gap?: number
  fadeOut?: boolean
  pauseOnHover?: boolean
  scaleOnHover?: boolean
  draggable?: boolean
  ariaLabel?: string
  className?: string
}

const defaultLogoWidth = 180
const defaultLogoHeight = 56

export default function LogoLoop({
  logos,
  speed = 80,
  logoHeight = 28,
  gap = 48,
  fadeOut = true,
  pauseOnHover = true,
  scaleOnHover = true,
  draggable = true,
  ariaLabel = 'Technology logos',
  className = '',
}: LogoLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLUListElement>(null)
  const offsetRef = useRef(0)
  const loopDistanceRef = useRef(0)
  const pointerRef = useRef<{ id: number; x: number } | null>(null)
  const pausedRef = useRef(false)
  const reconcileRef = useRef<() => void>(() => {})

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const firstSet = firstSetRef.current
    if (!root || !track || !firstSet || logos.length === 0) return

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    let reducedMotion = reducedMotionQuery.matches
    let inViewport = false
    let previousTime = 0
    let frame = 0

    const measure = () => {
      loopDistanceRef.current = firstSet.getBoundingClientRect().width + gap
    }

    const canAnimate = () =>
      !reducedMotion &&
      inViewport &&
      !document.hidden &&
      !pausedRef.current &&
      !pointerRef.current

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
    }

    const render = (time: number) => {
      frame = 0
      if (!canAnimate()) return

      if (previousTime === 0) previousTime = time
      const elapsed = Math.min(time - previousTime, 48)
      previousTime = time
      offsetRef.current -= (speed * elapsed) / 1000

      const distance = loopDistanceRef.current
      if (distance > 0) {
        offsetRef.current %= distance
        if (offsetRef.current > 0) offsetRef.current -= distance
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      frame = window.requestAnimationFrame(render)
    }

    const reconcile = () => {
      if (!canAnimate()) {
        stop()
      } else if (!frame) {
        previousTime = 0
        frame = window.requestAnimationFrame(render)
      }
    }

    reconcileRef.current = reconcile

    const intersectionObserver =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            inViewport = entry.isIntersecting
            reconcile()
          })
    if (intersectionObserver) {
      intersectionObserver.observe(root)
    } else {
      inViewport = true
    }

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    resizeObserver?.observe(firstSet)
    measure()

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      if (reducedMotion) {
        offsetRef.current = 0
        track.style.transform = 'translate3d(0, 0, 0)'
      }
      reconcile()
    }
    const onVisibilityChange = () => reconcile()

    reducedMotionQuery.addEventListener('change', onMotionPreferenceChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    reconcile()

    return () => {
      stop()
      reconcileRef.current = () => {}
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      reducedMotionQuery.removeEventListener('change', onMotionPreferenceChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [gap, logos.length, speed])

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!draggable || (event.pointerType === 'mouse' && event.button !== 0)) {
        return
      }

      pointerRef.current = { id: event.pointerId, x: event.clientX }
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.dataset.dragging = 'true'
      reconcileRef.current()
    },
    [draggable],
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const pointer = pointerRef.current
      if (!pointer || pointer.id !== event.pointerId) return

      const distance = loopDistanceRef.current
      let nextOffset = offsetRef.current + event.clientX - pointer.x
      pointer.x = event.clientX
      if (distance > 0) {
        nextOffset %= distance
        if (nextOffset > 0) nextOffset -= distance
      }
      offsetRef.current = nextOffset
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${nextOffset}px, 0, 0)`
      }
    },
    [],
  )

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current?.id !== event.pointerId) return

    pointerRef.current = null
    delete event.currentTarget.dataset.dragging
    reconcileRef.current()
  }, [])

  const handleFocus = useCallback(() => {
    if (pauseOnHover) {
      pausedRef.current = true
      reconcileRef.current()
    }
  }, [pauseOnHover])

  const handleBlur = useCallback(() => {
    if (pauseOnHover) {
      pausedRef.current = false
      reconcileRef.current()
    }
  }, [pauseOnHover])

  const listStyle = { gap: `${gap}px` } satisfies CSSProperties

  const logoSet = (duplicate = false) => (
    <ul
      ref={duplicate ? undefined : firstSetRef}
      className="flex shrink-0 items-center"
      style={listStyle}
      aria-hidden={duplicate ? true : undefined}
    >
      {logos.map((logo, index) => (
        <li
          key={`${typeof logo.src === 'string' ? logo.src : logo.src.src}-${index}`}
          className="flex shrink-0 items-center justify-center"
        >
          <Image
            src={logo.src}
            alt={duplicate ? '' : logo.alt}
            width={logo.width ?? defaultLogoWidth}
            height={logo.height ?? defaultLogoHeight}
            unoptimized
            draggable={false}
            className={`max-w-[180px] select-none object-contain opacity-65 transition duration-200 ${scaleOnHover ? 'group-hover/loop:scale-105 group-hover/loop:opacity-100' : ''} ${logo.className ?? ''}`}
            style={{ height: logoHeight, width: 'auto' }}
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      ref={rootRef}
      className={`group/loop relative overflow-hidden ${
        draggable ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''
      } ${className}`}
      style={
        fadeOut
          ? {
              maskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }
          : undefined
      }
      role="region"
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={(event) => {
        if (pauseOnHover && event.pointerType === 'mouse') {
          pausedRef.current = true
          reconcileRef.current()
        }
      }}
      onPointerLeave={(event) => {
        if (
          pauseOnHover &&
          event.pointerType === 'mouse' &&
          !pointerRef.current
        ) {
          pausedRef.current = false
          reconcileRef.current()
        }
      }}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        style={{ gap: `${gap}px` }}
      >
        {logoSet()}
        {logoSet(true)}
      </div>
    </div>
  )
}
