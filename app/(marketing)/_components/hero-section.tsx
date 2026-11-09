'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import BlurText from '@/components/reactbits/BlurText'
import StarBorder from '@/components/reactbits/StarBorder'
import Aurora from '@/components/reactbits/Aurora'
import useHydrated from '@/components/reactbits/useHydrated'
import { useTheme } from 'next-themes'
import { HeroHeader } from './header'
import HeroLight from '@/public/screenshot-light.webp'
import HeroDark from '@/public/screenshot-dark.webp'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 0.45,
      },
    },
  },
}

export default function HeroSection() {
  const { resolvedTheme } = useTheme()
  const isDark = useHydrated() && resolvedTheme === 'dark'
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section>
          <div className="relative isolate pt-24 md:pt-36">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
              <Aurora
                colorStops={['#C76A1A', '#E8B44A', '#7CB67C']}
                amplitude={0.8}
                blend={0.6}
                speed={0.8}
                lightMode={!isDark}
                mouseInteraction
                opacity={isDark ? 0.65 : 0.18}
                className="absolute inset-0"
              />
            </div>

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#features"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm">
                      New: AI thread summaries
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <BlurText
                  text="The AI-ready home for team communication"
                  animateBy="words"
                  trigger="load"
                  effect="blur"
                  delay={60}
                  stepDuration={0.22}
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                />
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.15}
                  delay={0.1}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                >
                  Channels, threads and realtime chat with AI summaries that
                  keep product teams in sync.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.1,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-5 md:flex-row"
                >
                  <StarBorder
                    key={1}
                    as={Link}
                    href="/workspace"
                    prefetch={false}
                    color="#C76A1A"
                    duration={4}
                    className="rounded-xl px-5 py-3 text-base font-semibold"
                  >
                    Get Started <ArrowRight className="size-4" />
                  </StarBorder>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="secondary"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link href="#how-it-works">
                      <span className="text-nowrap">See how it works</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <div className="mx-auto max-w-7xl">
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl object-contain object-top dark:block"
                    src={HeroDark}
                    alt="VPFlow workspace in dark mode"
                    width="2700"
                    height="1440"
                    preload
                    fetchPriority="high"
                    unoptimized
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden  object-contain object-top"
                    src={HeroLight}
                    alt="VPFlow workspace in light mode"
                    width="2700"
                    height="1440"
                    preload
                    fetchPriority="high"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
