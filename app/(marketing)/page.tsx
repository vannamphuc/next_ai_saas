import type { Metadata } from 'next'
import HeroSection from './_components/hero-section'
import LogoLoopSection from './_components/logo-loop-section'
import FeaturesSection from './_components/features-section'
import HowItWorksSection from './_components/how-it-works-section'
import StatsSection from './_components/stats-section'
import PricingSection from './_components/pricing-section'
import FaqSection from './_components/faq-section'
import CtaSection from './_components/cta-section'
import SiteFooter from './_components/site-footer'
import ScrollVelocity from '@/components/reactbits/ScrollVelocity'

export const metadata: Metadata = {
  title: 'Team communication that stays in sync',
  description:
    'Bring channels, threads and AI summaries together in a calmer workspace for product teams.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Team communication that stays in sync',
    description:
      'Bring channels, threads and AI summaries together in a calmer workspace for product teams.',
    siteName: 'VPFlow',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VPFlow team communication preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team communication that stays in sync',
    description:
      'Bring channels, threads and AI summaries together in a calmer workspace for product teams.',
    images: [
      {
        url: '/og-image.png',
        alt: 'VPFlow team communication preview',
      },
    ],
  },
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <LogoLoopSection />
      <FeaturesSection />
      <ScrollVelocity
        texts={['Clear context · Fewer check-ins · Better teamwork']}
        velocity={24}
        fontSize="0.875rem"
        fontWeight={600}
        gap={24}
        separator="•"
        className="tracking-[0.08em] text-muted-foreground"
      />
      <HowItWorksSection />
      <StatsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <SiteFooter />
    </div>
  )
}
