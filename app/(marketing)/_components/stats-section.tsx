import CountUp from '@/components/reactbits/CountUp'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

const stats = [
  {
    value: 99.9,
    decimals: 1,
    suffix: '%',
    label: 'Uptime',
    description: 'A steady place for day-to-day team conversations.',
    accessibleLabel: '99.9 percent',
  },
  {
    value: 50,
    prefix: '<',
    suffix: 'ms',
    label: 'Sync time',
    description: 'Keep messages moving while the team is working.',
    accessibleLabel: 'Less than 50 milliseconds',
  },
  {
    value: 30,
    label: 'Messages per load',
    description: 'Pick up the recent conversation without the noise.',
    accessibleLabel: '30 messages per load',
  },
]

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="scroll-mt-24 border-b border-border/70 bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="text-sm font-semibold tracking-[0.16em] text-primary">
            ROOM TO FOCUS
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            The details that keep work moving
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Responsive conversations, useful context and less time spent
            repeating what the team already knows.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-card px-6 py-7 text-center shadow-sm sm:px-8 sm:py-9">
                <p className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  <CountUp
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    label={stat.accessibleLabel}
                  />
                </p>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {stat.label}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
