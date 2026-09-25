import { CheckIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Container, Section, SectionHeading } from '@/components/landing/section'

const steps = [
  {
    step: '01',
    title: 'Clone & configure',
    description:
      'Copy .env.example, drop in your DATABASE_URL, and install the web workspace. One file, two commands.',
  },
  {
    step: '02',
    title: 'Migrate & build',
    description:
      'Run the versioned migrations, then build the React app straight into the Go embed directory.',
  },
  {
    step: '03',
    title: 'Deploy as one',
    description:
      'A single Vercel deploy ships the API and the frontend on the same origin. No CORS, no split deploys.',
  },
]

const commands = [
  { prompt: true, text: 'cp .env.example .env   # add DATABASE_URL' },
  { prompt: true, text: 'npm install && make migrate' },
  { prompt: true, text: 'make run               # API + SPA on :3000' },
  { prompt: false, text: '✓ database pool ready' },
  { prompt: false, text: '✓ server starting  port=3000' },
]

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From clone to production{' '}
              <span className="text-gradient">in an afternoon.</span>
            </>
          }
          description="The workflow is the feature. Three steps stand between you and a deployed SaaS."
        />
        <div className="mt-12 grid items-start gap-4 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-4">
            {steps.map((item) => (
              <Card key={item.step}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Badge className="shrink-0 bg-linear-to-br from-brand-from to-brand-via px-2.5 py-1 font-mono text-xs text-white">
                      {item.step}
                    </Badge>
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden border-foreground/15 bg-zinc-950 text-zinc-100 dark:bg-zinc-900">
            <CardHeader className="border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-destructive/80" />
                <span className="size-2.5 rounded-full bg-warning/80" />
                <span className="size-2.5 rounded-full bg-success/80" />
                <span className="ml-2 font-mono text-xs text-zinc-400">
                  terminal — zsh
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 pt-4 font-mono text-[13px] leading-relaxed">
              {commands.map((cmd, i) => (
                <p key={i} className="flex items-start gap-2">
                  {cmd.prompt ? (
                    <>
                      <span className="shrink-0 bg-linear-to-r from-brand-from to-brand-to bg-clip-text font-semibold text-transparent">
                        $
                      </span>
                      <span className="break-all text-zinc-200">{cmd.text}</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5 text-success">
                      <CheckIcon className="size-3.5" />
                      {cmd.text.slice(2)}
                    </span>
                  )}
                </p>
              ))}
              <p className="mt-1 flex items-center gap-2 text-zinc-500">
                <span className="bg-linear-to-r from-brand-from to-brand-to bg-clip-text font-semibold text-transparent">
                  $
                </span>
                <span className="inline-block h-4 w-2 animate-pulse rounded-[2px] bg-zinc-400" />
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
