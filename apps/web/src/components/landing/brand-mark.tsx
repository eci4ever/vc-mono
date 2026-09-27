import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

import { BRAND_INITIAL, BRAND_NAME } from '@/lib/brand'
import { cn } from '@/lib/utils'

type BrandMarkProps = {
  className?: string
  to?: LinkProps['to']
}

export function BrandMark({ className, to = '/' }: BrandMarkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex min-w-0 items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-80',
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-foreground to-foreground/55 text-sm text-background shadow-sm">
        {BRAND_INITIAL}
      </span>
      <span className="truncate">{BRAND_NAME}</span>
    </Link>
  )
}
