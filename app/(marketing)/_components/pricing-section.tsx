import Link from 'next/link'
import { ArrowRight, CircleCheck } from 'lucide-react'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

const features = [
  'Focused channels and threaded conversations',
  'Shared context with AI summaries',
  'A workspace for your whole team',
]

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-b border-border/70 bg-card/40"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <ScrollReveal>
          <p className="text-sm font-semibold tracking-[0.16em] text-primary">
            PRICING
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Clear details, when they are ready
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            We are still finalizing plan details. You can explore the TailFlow
            workspace today and see how its core tools fit your team.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  TAILFLOW WORKSPACE
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  A shared home for team conversations
                </h3>
              </div>
              <span className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                Plan details coming soon
              </span>
            </div>

            <ul className="mt-6 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground">
                  <CircleCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/workspace"
              prefetch={false}
              className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
            >
              Explore the workspace
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
