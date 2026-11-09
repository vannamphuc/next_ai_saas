import { ChevronDown } from 'lucide-react'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

const questions = [
  {
    question: 'How do channels and threads help my team?',
    answer:
      'Channels give ongoing topics a clear home. Threads keep replies connected to the message they belong to, so conversations are easier to follow.',
  },
  {
    question: 'What can an AI summary do?',
    answer:
      'A summary can turn a long thread into a short recap, helping teammates catch up on the discussion and its key takeaways.',
  },
  {
    question: 'Can I explore TailFlow before choosing a plan?',
    answer:
      'Yes. Open the workspace to explore the product. Plan details are being finalized and will be shared here when they are ready.',
  },
  {
    question: 'Where can I find the pricing details?',
    answer:
      'The pricing section has the latest update. We will publish plan details there once they are finalized.',
  },
]

export default function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <ScrollReveal>
          <p className="text-sm font-semibold tracking-[0.16em] text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            A few things teams ask
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            Need more context? Start with the workspace or check back for plan
            updates.
          </p>
        </ScrollReveal>

        <div className="divide-y divide-border border-y border-border">
          {questions.map(({ question, answer }, index) => (
            <ScrollReveal key={question} delay={index * 0.05}>
              <details className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-left text-base font-semibold text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <p className="max-w-xl pr-8 pt-3 text-sm leading-6 text-muted-foreground">
                  {answer}
                </p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
