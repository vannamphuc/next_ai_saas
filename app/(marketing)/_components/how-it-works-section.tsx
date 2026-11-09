'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Check, MessageCircleMore, Sparkles, UsersRound } from 'lucide-react'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

const steps = [
  {
    number: '01',
    title: 'Bring your team together',
    description:
      'Create a workspace and invite the people who need the same context.',
    icon: UsersRound,
  },
  {
    number: '02',
    title: 'Keep each topic in its place',
    description:
      'Use channels for ongoing work and threads to keep replies focused.',
    icon: MessageCircleMore,
  },
  {
    number: '03',
    title: 'Catch up in a few moments',
    description:
      'Ask for a quick summary when a long conversation needs a clear recap.',
    icon: Sparkles,
  },
]

const messages = [
  {
    name: 'Maya Chen',
    initials: 'MC',
    color: 'bg-primary/15 text-primary',
    time: '10:24',
    text: 'The onboarding flow is ready for a final review. I added the latest notes to the thread.',
  },
  {
    name: 'Jordan Lee',
    initials: 'JL',
    color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    time: '10:28',
    text: 'Looks good. Let’s share the update with the whole team after lunch.',
  },
]

export default function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-border/70 bg-card/40"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <ScrollReveal>
            <p className="text-sm font-semibold tracking-[0.16em] text-primary">
              HOW IT WORKS
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              A calmer way to keep everyone in the loop
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Give conversations a clear home, keep decisions attached to their
              context and make it easier to catch up.
            </p>
          </ScrollReveal>

          <ol className="mt-9 space-y-6">
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <li key={number}>
                <ScrollReveal delay={index * 0.08}>
                  <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary shadow-sm">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                      STEP {number}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  </div>
              </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>

        <ScrollReveal distance={24}>
          <div
            aria-label="Sample VPFlow conversation with an AI summary"
            className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-foreground/5"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  # onboarding-launch
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  8 teammates · Sample conversation
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                In sync
              </span>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : 0.12 * index,
                  }}
                  className="flex gap-3"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${message.color}`}
                  >
                    {message.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <p className="text-sm font-semibold text-foreground">
                        {message.name}
                      </p>
                      <time className="text-xs text-muted-foreground">
                        {message.time}
                      </time>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {message.text}
                    </p>
                  </div>
                </motion.div>
              ))}

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sparkles
                    aria-hidden="true"
                    className="size-4 text-primary"
                  />
                  Thread summary
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The onboarding flow is ready for review. The team agreed to
                  share the update after lunch.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Check aria-hidden="true" className="size-3.5" />
                  Decision captured
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-muted/40 px-5 py-3 text-center text-xs text-muted-foreground">
              A small preview of a more connected workday
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
