import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { Logos } from '@/components/landing/logos'
import { Features } from '@/components/landing/features'
import { Metrics } from '@/components/landing/metrics'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { Faq } from '@/components/landing/faq'
import { Cta } from '@/components/landing/cta'
import { SiteFooter } from '@/components/landing/site-footer'

function Landing() {
  return (
    <div id="top" className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Logos />
        <Features />
        <Metrics />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}

export const Route = createFileRoute('/')({ component: Landing })
