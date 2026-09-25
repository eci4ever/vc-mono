import { Link } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  CheckIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  StarIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar'
import { Container, Glow } from '@/components/landing/section'

const trustPoints = ['Free & open source', 'Deploys in minutes', 'No credit card']

const builders = [
  { initials: 'AR', label: 'Amara R.' },
  { initials: 'JT', label: 'Jonas T.' },
  { initials: 'SK', label: 'Sofia K.' },
  { initials: 'DM', label: 'Daniel M.' },
]

const mockStats = [
  { label: 'Monthly recurring revenue', value: '$48.2k', delta: '+12.4%' },
  { label: 'Active users', value: '8,412', delta: '+8.1%' },
  { label: 'API p50 latency', value: '12ms', delta: '-3.2ms' },
]

function ProductMockup() {
  return (
    <div className="relative mx-auto mt-14 max-w-5xl sm:mt-20">
      <Glow className="-top-32 left-1/4 size-96" />
      <Glow className="-right-10 -bottom-24 size-96 opacity-15" />
      <div className="relative rounded-2xl bg-linear-to-b from-brand-from/70 via-brand-via/40 to-brand-to/30 p-px shadow-2xl">
        <div className="overflow-hidden rounded-[calc(var(--radius-xl)-1px)] bg-card">
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
            </div>
            <div className="mx-auto flex h-7 w-full max-w-sm items-center justify-center rounded-md bg-muted px-3 text-xs text-muted-foreground">
              vc-mono.app/dashboard
            </div>
            <div className="w-14 shrink-0" />
          </div>

          <div className="grid sm:grid-cols-[190px_1fr]">
            <div className="hidden flex-col gap-1 border-r p-4 sm:flex">
              <div className="mb-3 h-2.5 w-16 rounded-full bg-linear-to-r from-brand-from to-brand-via" />
              {['Overview', 'Customers', 'Billing', 'API keys', 'Settings'].map(
                (item, i) => (
                  <div
                    key={item}
                    className={
                      i === 0
                        ? 'flex items-center gap-2 rounded-lg bg-muted px-2.5 py-2'
                        : 'flex items-center gap-2 rounded-lg px-2.5 py-2'
                    }
                  >
                    <span
                      className={
                        i === 0
                          ? 'size-2 rounded-full bg-linear-to-br from-brand-from to-brand-via'
                          : 'size-2 rounded-full bg-muted-foreground/30'
                      }
                    />
                    <span
                      className={
                        i === 0
                          ? 'h-2 w-16 rounded-full bg-foreground/70'
                          : 'h-2 w-16 rounded-full bg-muted-foreground/25'
                      }
                    />
                  </div>
                ),
              )}
              <div className="mt-auto flex items-center gap-2 rounded-lg border p-2.5">
                <span className="size-6 shrink-0 rounded-full bg-linear-to-br from-brand-via to-brand-to" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <span className="h-2 w-14 rounded-full bg-foreground/60" />
                  <span className="h-1.5 w-10 rounded-full bg-muted-foreground/25" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-muted/20 p-4 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {mockStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-1 rounded-xl border bg-card p-3.5"
                  >
                    <span className="truncate text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-xl font-semibold tracking-tight tabular-nums">
                        {stat.value}
                      </span>
                      <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[11px] font-medium text-success">
                        {stat.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="h-2 w-24 rounded-full bg-foreground/60" />
                  <span className="h-2 w-12 rounded-full bg-muted-foreground/25" />
                </div>
                <svg
                  viewBox="0 0 320 120"
                  className="h-28 w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id="hero-line"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="var(--brand-from)" />
                      <stop offset="55%" stopColor="var(--brand-via)" />
                      <stop offset="100%" stopColor="var(--brand-to)" />
                    </linearGradient>
                    <linearGradient
                      id="hero-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--brand-via)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--brand-via)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  {[30, 60, 90].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="320"
                      y2={y}
                      stroke="var(--grid-line)"
                      strokeWidth="1"
                    />
                  ))}
                  <path
                    d="M0 96 C 30 84, 45 92, 70 74 S 115 60, 140 68 S 190 30, 220 42 S 280 20, 320 28 L320 120 L0 120 Z"
                    fill="url(#hero-fill)"
                  />
                  <path
                    d="M0 96 C 30 84, 45 92, 70 74 S 115 60, 140 68 S 190 30, 220 42 S 280 20, 320 28"
                    fill="none"
                    stroke="url(#hero-line)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="220"
                    cy="42"
                    r="4"
                    fill="var(--brand-via)"
                    stroke="var(--color-card)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-grid mask-fade-bottom opacity-70"
      />
      <Glow className="-top-40 left-1/2 size-[42rem] -translate-x-1/2 opacity-25" />

      <Container className="relative pt-16 pb-16 sm:pt-24 sm:pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="outline" className="gap-1.5 py-1 pr-3 pl-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-linear-to-br from-brand-from to-brand-via text-white">
              <SparklesIcon className="size-3" />
            </span>
            v1.0 — Go Fiber API + React starter
          </Badge>

          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            One repo, one binary,{' '}
            <span className="text-gradient">one origin.</span>
          </h1>

          <p className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
            vc-mono is a production-ready SaaS starter: a Go Fiber API and a
            polished React app deployed together on Vercel — Postgres,
            migrations, and typed SQL included.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href="#pricing" />}
            >
              Start building
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link to="/dashboard" />}
            >
              <LayoutDashboardIcon data-icon="inline-start" />
              View live demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5">
                <CheckIcon className="size-3.5 text-success" />
                {point}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <AvatarGroup>
              {builders.map((b) => (
                <Avatar key={b.initials}>
                  <AvatarFallback className="bg-linear-to-br from-brand-from/25 via-brand-via/20 to-brand-to/25 font-medium text-foreground">
                    {b.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+2k</AvatarGroupCount>
            </AvatarGroup>
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Loved by 2,400+ builders shipping this weekend
              </p>
            </div>
          </div>
        </div>

        <ProductMockup />
      </Container>
    </div>
  )
}
