import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import StarBorder from '@/components/reactbits/StarBorder'

export default function CtaSection() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-t border-border bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(55% 100% at 50% 100%, color-mix(in oklch, var(--primary) 15%, transparent), transparent)',
          }}
        />
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Give every conversation a place to land.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Bring your team together with channels, threads and summaries that
              keep everyone moving in the same direction.
            </p>
          </div>
          <Link
            href="/workspace"
            prefetch={false}
            className="inline-flex cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <StarBorder
              as="span"
              color="#C76A1A"
              duration={4}
              className="rounded-xl px-5 py-3 text-base font-semibold"
            >
              Get Started <ArrowRight aria-hidden="true" className="size-4" />
            </StarBorder>
          </Link>
        </div>
      </section>
    </>
  )
}
