import {
  GaugeIcon,
  GlobeIcon,
  LayersIcon,
  ServerCogIcon,
  ShieldCheckIcon,
  WorkflowIcon,
} from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Container, Section, SectionHeading } from '@/components/landing/section'

const features = [
  {
    icon: GlobeIcon,
    title: 'Single origin by design',
    description:
      'The React build is embedded into the Go binary. One server serves the API and the frontend — no CORS, no extra deploy targets.',
  },
  {
    icon: ServerCogIcon,
    title: 'Typed SQL with sqlc',
    description:
      'Write SQL, get type-safe Go queries. The generated code lives apart from your hand-written database layer.',
  },
  {
    icon: GaugeIcon,
    title: 'Fast by default',
    description:
      'Fiber on fasthttp, compression and security headers baked in, and a serverless-friendly Postgres pool tuned for Neon.',
  },
  {
    icon: WorkflowIcon,
    title: 'Migrations included',
    description:
      'Versioned migrations with advisory locking, tracked in schema_migrations. Add a file, run make migrate, done.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Production hardening',
    description:
      'Rate-limited writes, structured JSON logs with request IDs, panic recovery, and JSON 404s that never leak the SPA.',
  },
  {
    icon: LayersIcon,
    title: 'Modern frontend stack',
    description:
      'React 19, TanStack Router and Query, Tailwind v4 and shadcn/ui — with a dev server that proxies /api to Go.',
  },
]

export function Features() {
  return (
    <Section id="features">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need,{' '}
              <span className="text-gradient">nothing you don't.</span>
            </>
          }
          description="A starter should get out of your way. vc-mono wires up the unglamorous parts so you can spend the weekend on your product."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-from via-brand-via to-brand-to text-white shadow-sm">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
