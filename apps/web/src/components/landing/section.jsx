import { ActivityIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Container({ className, children }) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}
    >
      {children}
    </div>
  )
}

export function Section({ id, className, children }) {
  return (
    <section id={id} className={cn('scroll-mt-20 py-16 sm:py-24', className)}>
      {children}
    </section>
  )
}

export function Eyebrow({ className, children }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}) {
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered ? 'mx-auto max-w-2xl items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function BrandMark({ className }) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand-from via-brand-via to-brand-to text-white shadow-sm',
        className,
      )}
    >
      <ActivityIcon className="size-4" />
    </span>
  )
}

export function Glow({ className }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute rounded-full bg-linear-to-br from-brand-from via-brand-via to-brand-to opacity-20 blur-3xl',
        className,
      )}
    />
  )
}
