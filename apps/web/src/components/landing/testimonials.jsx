import { StarIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import { Container, Section, SectionHeading } from '@/components/landing/section'

const testimonials = [
  {
    quote:
      'I deleted three repos the day I found vc-mono. API, web, and deploys finally live in one place — and it just works.',
    name: 'Amara Rahmani',
    role: 'Indie hacker, shipfast.id',
    initials: 'AR',
  },
  {
    quote:
      'The sqlc setup alone saved me a week. Typed queries, versioned migrations, structured logs — it reads like a senior wrote it.',
    name: 'Jonas Tanuwijaya',
    role: 'Backend engineer, fintech',
    initials: 'JT',
  },
  {
    quote:
      'Deployed Friday night, onboarding users Saturday morning. Single-origin on Vercel meant zero infra yak-shaving.',
    name: 'Sofia Kartika',
    role: 'Founder, analytics SaaS',
    initials: 'SK',
  },
]

export function Testimonials() {
  return (
    <Section id="testimonials" className="bg-muted/30">
      <Container>
        <SectionHeading
          eyebrow="Loved by builders"
          title={
            <>
              Weekends are for shipping,{' '}
              <span className="text-gradient">not configuring.</span>
            </>
          }
          description="Indie hackers and small teams use vc-mono to skip the boilerplate and get to revenue."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col">
              <CardHeader>
                <div
                  className="flex items-center gap-0.5"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className="size-3.5 fill-primary text-primary"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-6">
                <p className="flex-1 text-sm leading-relaxed text-pretty">
                  “{t.quote}”
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-linear-to-br from-brand-from/25 via-brand-via/20 to-brand-to/25 font-medium text-foreground">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
