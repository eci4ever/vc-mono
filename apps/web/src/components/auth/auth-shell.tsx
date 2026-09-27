import type { ReactNode } from 'react'
import type { ComponentProps } from 'react'
import { Link } from '@tanstack/react-router'

import { BrandMark } from '@/components/landing/brand-mark'
import { Input } from '@/components/ui/input'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

/** Shared shell for the mock auth pages: brand header + centered card. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
          <BrandMark />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm rounded-2xl border border-border p-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

          {children}

          {footer ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  )
}

const fieldClass =
  'h-11 rounded-xl border-border bg-transparent px-3 font-normal placeholder:text-muted-foreground/70 focus-visible:border-foreground'

type AuthFieldProps = {
  label: string
  error?: boolean
} & Omit<ComponentProps<'input'>, 'className'>

/** Label + input pair styled for the auth card. */
export function AuthField({ label, error, ...inputProps }: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <Input
        className={fieldClass}
        aria-invalid={error || undefined}
        {...inputProps}
      />
    </label>
  )
}
