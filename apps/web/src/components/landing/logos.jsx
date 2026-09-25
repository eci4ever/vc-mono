import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/landing/section'

const stack = [
  'Go 1.27',
  'Fiber v3',
  'PostgreSQL',
  'React 19',
  'Vite',
  'TanStack',
  'Tailwind v4',
  'Vercel',
]

export function Logos() {
  return (
    <Container className="pb-4">
      <p className="text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Built on a boring, proven stack
      </p>
      <div className="mask-fade-edges mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {stack.map((name) => (
          <span
            key={name}
            className="font-heading text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            {name}
          </span>
        ))}
      </div>
      <Separator className="mt-10" />
    </Container>
  )
}
