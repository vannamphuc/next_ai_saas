import LogoLoop, { type LogoLoopItem } from '@/components/reactbits/LogoLoop'
import Arcjet from '@/public/companies/arcjet.webp'
import Kinde from '@/public/companies/kinde.webp'
import Vercel from '@/public/companies/vercel.webp'
import Neon from '@/public/companies/neon.webp'
import ORPC from '@/public/companies/orpc.webp'
import Prisma from '@/public/companies/prisma.webp'
import Motion from '@/public/companies/motion.webp'
import Claude from '@/public/companies/claude.webp'

const logos: LogoLoopItem[] = [
  {
    src: Arcjet,
    alt: 'Arcjet',
    width: 1040,
    height: 370,
    className: 'dark:invert',
  },
  {
    src: Kinde,
    alt: 'Kinde',
    width: 600,
    height: 199,
    className: 'dark:invert',
  },
  {
    src: Vercel,
    alt: 'Vercel',
    width: 2048,
    height: 407,
    className: 'dark:invert',
  },
  {
    src: Neon,
    alt: 'Neon',
    width: 1024,
    height: 290,
    className: 'invert dark:invert-0',
  },
  {
    src: ORPC,
    alt: 'ORPC',
    width: 1706,
    height: 734,
    className: 'dark:invert',
  },
  {
    src: Prisma,
    alt: 'Prisma',
    width: 2500,
    height: 982,
    className: 'dark:invert',
  },
  {
    src: Motion,
    alt: 'Motion',
    width: 1024,
    height: 393,
    className: 'invert dark:invert-0',
  },
  {
    src: Claude,
    alt: 'Claude',
    width: 1280,
    height: 275,
    className: 'dark:invert',
  },
]

export default function LogoLoopSection() {
  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-7 text-center text-xs font-semibold tracking-[0.16em] text-muted-foreground">
          BUILT WITH MODERN STACK
        </p>
        <LogoLoop
          logos={logos}
          speed={80}
          logoHeight={28}
          gap={48}
          fadeOut
          pauseOnHover
          scaleOnHover
          draggable
          ariaLabel="Built with"
          className="py-3"
        />
      </div>
    </section>
  )
}
