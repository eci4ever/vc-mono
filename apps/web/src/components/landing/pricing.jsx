import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Container, Section, SectionHeading } from '@/components/landing/section'

const tiers = [
  {
    name: 'Hobby',
    price: '$0',
    period: 'forever',
    description: 'For side projects and weekends.',
    cta: 'Start for free',
    featured: false,
    features: [
      'Full starter source code',
      'Go Fiber API + React app',
      'Postgres + typed sqlc queries',
      'Single-origin Vercel deploy',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'one-time',
    description: 'For founders shipping to revenue.',
    cta: 'Get lifetime access',
    featured: true,
    features: [
      'Everything in Hobby',
      'Auth + sessions blueprint',
      'Stripe billing blueprint',
      'Email + background jobs',
      'Admin dashboard blocks',
      'Priority support + updates',
    ],
  },
  {
    name: 'Team',
    price: '$149',
    period: 'one-time',
    description: 'For teams with bigger ambitions.',
    cta: 'Talk to us',
    featured: false,
    features: [
      'Everything in Pro',
      'Multi-tenant blueprint',
      'SSO + audit logs',
      'Staging environment guide',
      '1:1 onboarding call',
    ],
  },
]

export function Pricing() {
  return (
    <Section id="pricing">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Pay once, <span className="text-gradient">ship forever.</span>
            </>
          }
          description="No subscriptions, no seat math. Buy the starter once and keep every line of code."
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">
          {tiers.map((tier) =>
            tier.featured ? (
              <div
                key={tier.name}
                className="rounded-2xl bg-linear-to-b from-brand-from via-brand-via to-brand-to p-px shadow-xl"
              >
                <Card className="h-full gap-0 border-0 py-0">
                  <CardHeader className="gap-1 px-6 pt-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{tier.name}</CardTitle>
                      <Badge className="bg-linear-to-r from-brand-from to-brand-via text-white">
                        Most popular
                      </Badge>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                    <p className="mt-3 flex items-baseline gap-1.5">
                      <span className="font-heading text-4xl font-semibold tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tier.period}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    <ul className="flex flex-col gap-2.5">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-0 bg-transparent px-6 pb-6">
                    <Button className="w-full" size="lg">
                      {tier.cta}
                      <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card key={tier.name} className="gap-0 py-0">
                <CardHeader className="gap-1 px-6 pt-6">
                  <CardTitle className="text-base">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-heading text-4xl font-semibold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="px-6 py-5">
                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="border-0 bg-transparent px-6 pb-6">
                  <Button variant="outline" className="w-full" size="lg">
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ),
          )}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
          30-day money-back guarantee. If vc-mono doesn't save you a weekend,
          we'll refund you — no questions asked.
        </p>
      </Container>
    </Section>
  )
}
