import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandMark, Container } from '@/components/landing/section'

const nav = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="font-heading text-base font-semibold tracking-tight">
            vc-mono
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link to="/dashboard" />}
            className="hidden sm:inline-flex"
          >
            Live demo
          </Button>
          <Button nativeButton={false} render={<a href="#pricing" />}>
            Get started
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </Container>
    </header>
  )
}
