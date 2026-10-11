import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, SparklesIcon } from 'lucide-react'

import { BrandMark } from '@/components/landing/brand-mark'
import { StatusPills } from '@/components/landing/status-pills'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { sessionQuery } from '@/lib/auth'
import { STACK } from '@/lib/brand'
import { usePageTitle } from '@/lib/use-page-title'

function Landing() {
  // Signed-in visitors get dashboard shortcuts instead of signup CTAs.
  // The skeleton placeholders avoid a flicker while the session resolves.
  usePageTitle('Ship your SaaS faster with a Go starter')
  const { data: user, isPending } = useQuery(sessionQuery)

  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient gradient wash across the top of the page. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[560px] bg-linear-to-b from-foreground/[0.05] to-transparent dark:from-foreground/[0.08]" />
      {/* Blurred orbs that give the wash its falloff. */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-[-240px] left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-foreground/10 blur-[140px] dark:bg-foreground/15" />
        <div className="absolute top-[-160px] left-[16%] size-[420px] rounded-full bg-foreground/[0.07] blur-[120px] dark:bg-foreground/[0.09]" />
        <div className="absolute top-[-120px] right-[14%] size-[380px] rounded-full bg-foreground/[0.05] blur-[120px] dark:bg-foreground/[0.07]" />
      </div>
      {/* Grid that fades out toward the bottom. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_85%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_85%,transparent)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <BrandMark />
        <div className="flex shrink-0 items-center gap-3">
          {isPending ? (
            <Skeleton className="h-9 w-28 rounded-full" />
          ) : user ? (
            <Button
              nativeButton={false}
              render={<Link to="/dashboard" />}
              className="h-9 rounded-full px-4"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign in
              </Link>
              <Button
                nativeButton={false}
                render={<Link to="/signup" />}
                className="h-9 rounded-full px-4"
              >
                Get started
              </Button>
            </>
          )}
        </div>
      </header>

      <main id="main" className="flex flex-1 items-center justify-center px-6 pb-16">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center">
          <span className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 fill-mode-both inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground duration-700">
            <SparklesIcon className="size-3.5" />
            Built with Go, Fiber, sqlc &amp; Postgres
          </span>

          <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 fill-mode-both max-w-3xl font-heading text-4xl font-semibold tracking-tighter text-balance delay-100 duration-700 sm:text-6xl">
            <span className="bg-linear-to-b from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Ship your SaaS faster with a Go starter
            </span>
          </h1>

          <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 fill-mode-both max-w-xl text-lg leading-8 text-balance text-muted-foreground delay-200 duration-700">
            Fiber API, embedded React SPA, and Postgres with typed SQL and
            versioned migrations — one repo, one binary, one origin. Clone it,
            brand it, ship it.
          </p>

          <div className="flex w-full motion-safe:animate-in motion-safe:fade-in items-center justify-center fill-mode-both delay-300 duration-700 sm:w-auto">
            {isPending ? (
              <Skeleton className="h-12 w-48 rounded-full" />
            ) : user ? (
              <Button
                nativeButton={false}
                render={<Link to="/dashboard" />}
                className="h-12 w-full rounded-full px-6 text-base sm:w-auto"
              >
                Open dashboard
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            ) : (
              <Button
                nativeButton={false}
                render={<Link to="/signup" />}
                className="h-12 w-full rounded-full px-6 text-base sm:w-auto"
              >
                Get started
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            )}
          </div>

          <div className="flex motion-safe:animate-in motion-safe:fade-in flex-col items-center gap-3 fill-mode-both delay-[450ms] duration-700">
            <StatusPills />
            <p className="text-xs text-muted-foreground">{STACK.join(' · ')}</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/')({ component: Landing })
