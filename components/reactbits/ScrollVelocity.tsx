'use client'

import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  motion,
} from 'motion/react'
import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from 'react'
import styles from './ScrollVelocity.module.css'

type VelocityMapping = {
  input: number[]
  output: number[]
}

type ScrollVelocityProps = {
  scrollContainerRef?: RefObject<HTMLElement | null>
  texts?: ReactNode[]
  velocity?: number
  color?: string
  fontSize?: number | string
  fontWeight?: number | string
  skewWithVelocity?: number
  scaleWithVelocity?: number
  draggable?: boolean
  outlineAlternate?: boolean
  gap?: number
  className?: string
  damping?: number
  stiffness?: number
  numCopies?: number
  separator?: ReactNode
  fadeEdges?: boolean
  pauseOnHover?: boolean
  velocityMapping?: VelocityMapping
  parallaxClassName?: string
  scrollerClassName?: string
  parallaxStyle?: CSSProperties
  scrollerStyle?: CSSProperties
}

type DragState = {
  active: boolean
  pointerId: number
  lastX: number
  lastTime: number
  velocity: number
  travel: number
}

const smootherstep = (value: number) =>
  value * value * value * (value * (value * 6 - 15) + 10)

const fadeSteps = Array.from({ length: 9 }, (_, index) => index / 8)
const fadeMask = `linear-gradient(to right, ${[
  ...fadeSteps.map(
    (value) =>
      `rgba(0, 0, 0, ${smootherstep(value).toFixed(3)}) ${(value * 12).toFixed(1)}%`,
  ),
  ...fadeSteps.map(
    (value) =>
      `rgba(0, 0, 0, ${smootherstep(1 - value).toFixed(3)}) ${(88 + value * 12).toFixed(1)}%`,
  ),
].join(', ')})`

const outlineStyle: CSSProperties = {
  WebkitTextFillColor: 'transparent',
  WebkitTextStroke: 'max(1px, 0.028em) currentColor',
}

function wrap(min: number, max: number, value: number) {
  const range = max - min
  const modulo = (((value - min) % range) + range) % range
  return modulo + min
}

function useElementWidth(ref: RefObject<HTMLSpanElement | null>) {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof ResizeObserver === 'undefined') {
      const updateWidth = () => setWidth(element.offsetWidth)
      updateWidth()
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width)
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return width
}

type VelocityTextProps = {
  children: ReactNode
  baseVelocity: number
  scrollContainerRef?: RefObject<HTMLElement | null>
  className: string
  damping: number
  stiffness: number
  numCopies: number
  velocityMapping: VelocityMapping
  parallaxClassName: string
  scrollerClassName: string
  scrollerStyle?: CSSProperties
  separator: ReactNode
  pauseOnHover: boolean
  hoveredRef: RefObject<boolean | null>
  skewWithVelocity: number
  scaleWithVelocity: number
  outline: boolean
  gap: number
  fontSize?: number | string
  fontWeight?: number | string
  color?: string
  draggable: boolean
}

function VelocityText({
  children,
  baseVelocity,
  scrollContainerRef,
  className,
  damping,
  stiffness,
  numCopies,
  velocityMapping,
  parallaxClassName,
  scrollerClassName,
  scrollerStyle,
  separator,
  pauseOnHover,
  hoveredRef,
  skewWithVelocity,
  scaleWithVelocity,
  outline,
  gap,
  fontSize,
  fontWeight,
  color,
  draggable,
}: VelocityTextProps) {
  const baseX = useMotionValue(0)
  const skewX = useMotionValue(0)
  const scaleY = useMotionValue(1)
  const { scrollY } = useScroll(
    scrollContainerRef ? { container: scrollContainerRef } : undefined,
  )
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness })
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false },
  )
  const reduceMotion = useReducedMotion()

  const copyRef = useRef<HTMLSpanElement>(null)
  const copyWidth = useElementWidth(copyRef)
  const x = useTransform(baseX, (value) => {
    if (copyWidth === 0) return '0px'
    return `${wrap(-copyWidth, 0, value)}px`
  })

  const directionFactor = useRef(1)
  const pace = useRef(1)
  const fling = useRef(0)
  const drag = useRef<DragState>({
    active: false,
    pointerId: -1,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    travel: 0,
  })

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return

    const grab = drag.current
    const seconds = Math.min(delta, 64) / 1000
    const targetPace = grab.active || (pauseOnHover && hoveredRef.current) ? 0 : 1
    pace.current += (targetPace - pace.current) * (1 - Math.exp(-delta / 150))

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    const currentVelocityFactor = velocityFactor.get()

    if (currentVelocityFactor < 0) {
      directionFactor.current = -1
    } else if (currentVelocityFactor > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * currentVelocityFactor
    let travel = moveBy * pace.current

    if (!grab.active && fling.current !== 0) {
      travel += fling.current * seconds
      fling.current *= Math.exp(-delta / 420)
      if (Math.abs(fling.current) < 4) fling.current = 0
    }

    baseX.set(baseX.get() + travel)

    if (skewWithVelocity === 0 && scaleWithVelocity === 0) return

    const thrown = grab.active ? grab.velocity : fling.current
    const scrollSurge = Math.tanh(Math.abs(smoothVelocity.get()) / 1600) * pace.current
    const throwSurge = Math.tanh(Math.abs(thrown) / 2000)
    const surge = Math.max(scrollSurge, throwSurge)
    const heading =
      throwSurge > scrollSurge
        ? Math.sign(thrown)
        : Math.sign(travel) || directionFactor.current * Math.sign(baseVelocity)
    const ease = 1 - Math.exp(-delta / 110)
    const nextSkew =
      skewX.get() + (-heading * skewWithVelocity * surge - skewX.get()) * ease
    const nextScale =
      scaleY.get() + (1 + scaleWithVelocity * surge - scaleY.get()) * ease

    skewX.set(Math.abs(nextSkew) < 0.01 && skewWithVelocity === 0 ? 0 : nextSkew)
    scaleY.set(Math.abs(nextScale - 1) < 0.0005 && scaleWithVelocity === 0 ? 1 : nextScale)
  })

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || (event.pointerType === 'mouse' && event.button !== 0)) return

    const grab = drag.current
    grab.active = true
    grab.pointerId = event.pointerId
    grab.lastX = event.clientX
    grab.lastTime = event.timeStamp
    grab.velocity = 0
    grab.travel = 0
    fling.current = 0
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.currentTarget.style.cursor = 'grabbing'
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const grab = drag.current
    if (!grab.active || event.pointerId !== grab.pointerId) return

    const deltaX = event.clientX - grab.lastX
    const deltaTime = Math.max(event.timeStamp - grab.lastTime, 1)
    grab.lastX = event.clientX
    grab.lastTime = event.timeStamp
    grab.travel += Math.abs(deltaX)
    baseX.set(baseX.get() + deltaX)
    grab.velocity +=
      ((deltaX / deltaTime) * 1000 - grab.velocity) *
      (1 - Math.exp(-deltaTime / 50))
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const grab = drag.current
    if (!grab.active || event.pointerId !== grab.pointerId) return

    grab.active = false
    const resting = event.timeStamp - grab.lastTime > 90
    fling.current = resting
      ? 0
      : Math.max(-5000, Math.min(5000, grab.velocity))
    grab.velocity = 0

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    event.currentTarget.style.cursor = 'grab'
  }

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (drag.current.travel > 6) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const spans = Array.from({ length: numCopies }, (_, index) => (
    <span
      className={className}
      key={index}
      ref={index === 0 ? copyRef : null}
      aria-hidden={index > 0 ? true : undefined}
      style={!separator && gap > 0 ? { paddingRight: gap } : undefined}
    >
      {children}&nbsp;
      {separator ? (
        <>
          <span style={gap > 0 ? { margin: `0 ${gap / 2}px` } : undefined}>
            {separator}
          </span>
          &nbsp;
        </>
      ) : null}
    </span>
  ))

  const typeStyle: CSSProperties = {
    ...(fontSize !== undefined
      ? {
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          lineHeight: 1,
        }
      : {}),
    ...(fontWeight !== undefined ? { fontWeight } : {}),
    ...(color ? { color } : {}),
    ...(outline ? outlineStyle : {}),
  }

  return (
    <div
      className={`${styles.parallax} ${parallaxClassName}`}
      style={
        draggable
          ? {
              cursor: 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'pan-y',
            }
          : undefined
      }
      onPointerDown={draggable ? handlePointerDown : undefined}
      onPointerMove={draggable ? handlePointerMove : undefined}
      onPointerUp={draggable ? handlePointerUp : undefined}
      onPointerCancel={draggable ? handlePointerUp : undefined}
      onClickCapture={draggable ? handleClickCapture : undefined}
    >
      <motion.div
        className={scrollerClassName}
        style={{ x, skewX, scaleY, ...typeStyle, ...scrollerStyle }}
      >
        {spans}
      </motion.div>
    </div>
  )
}

export default function ScrollVelocity({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  color,
  fontSize,
  fontWeight,
  skewWithVelocity = 0,
  scaleWithVelocity = 0,
  draggable = false,
  outlineAlternate = false,
  gap = 0,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  separator = '',
  fadeEdges = false,
  pauseOnHover = false,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = '',
  scrollerClassName = '',
  parallaxStyle,
  scrollerStyle,
}: ScrollVelocityProps) {
  const hoveredRef = useRef(false)

  return (
    <div
      aria-hidden="true"
      className={styles.container}
      style={{
        width: '100%',
        ...(fadeEdges
          ? { WebkitMaskImage: fadeMask, maskImage: fadeMask }
          : {}),
        ...parallaxStyle,
      }}
      onPointerEnter={() => {
        hoveredRef.current = true
      }}
      onPointerLeave={() => {
        hoveredRef.current = false
      }}
    >
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={`border-y border-border/70 bg-card/50 py-4 ${parallaxClassName}`}
          scrollerClassName={`${styles.scroller} ${scrollerClassName}`}
          scrollerStyle={scrollerStyle}
          separator={separator}
          pauseOnHover={pauseOnHover}
          hoveredRef={hoveredRef}
          skewWithVelocity={skewWithVelocity}
          scaleWithVelocity={scaleWithVelocity}
          outline={outlineAlternate && index % 2 !== 0}
          gap={gap}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
          draggable={draggable}
        >
          {text}
        </VelocityText>
      ))}
    </div>
  )
}
