import { Link } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { BrandMark, Container } from '@/components/landing/section'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Live demo', to: '/dashboard' },
      { label: 'Changelog', href: '#top' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'API reference', to: '/dashboard' },
      { label: 'Stack', to: '/about' },
      { label: 'Status', to: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#top' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-heading text-base font-semibold tracking-tight">
                vc-mono
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              The production-ready SaaS starter. Go Fiber API + React app on a
              single origin.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span className="text-xs text-muted-foreground">
                All systems operational
              </span>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} className="flex flex-col gap-3">
              <p className="text-sm font-medium">{column.title}</p>
              {column.links.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 vc-mono. Ship something great.
          </p>
          <p className="text-xs text-muted-foreground">
            Go Fiber · React · single origin on Vercel
          </p>
        </div>
      </Container>
    </footer>
  )
}
