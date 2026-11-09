import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const linkGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Learn',
    links: [{ label: 'FAQ', href: '#faq' }],
  },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Link
              href="/"
              className="inline-flex rounded-sm text-lg font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              TailFlow
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Conversations, context and decisions in one shared workspace.
            </p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-foreground">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Ready to explore?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              See how your team can keep conversations moving.
            </p>
            <Link
              href="/workspace"
              prefetch={false}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open workspace
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} TailFlow</span>
          <span>Made for teams that move together.</span>
        </div>
      </div>
    </footer>
  )
}
