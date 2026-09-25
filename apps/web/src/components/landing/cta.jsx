import { ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container, Glow } from '@/components/landing/section'

export function Cta() {
  return (
    <Container className="pb-16 sm:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-16 text-center sm:px-12 sm:py-24 dark:bg-zinc-900">
        <div aria-hidden className="absolute inset-0 bg-grid grid-line-light opacity-40" />
        <Glow className="top-0 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-40" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-brand-via/25 to-transparent"
        />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            Ready when you are
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            Your SaaS is one{' '}
            <span className="text-gradient">weekend</span> away.
          </h2>
          <p className="max-w-xl text-base text-pretty text-zinc-400">
            Clone the starter, deploy on a single origin, and spend your time
            on customers — not configuration.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href="#pricing" />}
              className="bg-white text-zinc-950 hover:bg-zinc-200"
            >
              Get vc-mono Pro
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href="#how-it-works" />}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              See how it works
            </Button>
          </div>
          <p className="text-xs text-zinc-500">
            One-time payment · 30-day guarantee · Keep the code forever
          </p>
        </div>
      </div>
    </Container>
  )
}
