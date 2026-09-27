import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { AuthField, AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'

function LoginPage() {
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    // Mock: pretend to authenticate, nothing is sent anywhere.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setPending(false)
    setSubmitted(true)
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account."
      footer={
        <>
          No account?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        {submitted ? (
          <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            Mock only — authentication isn&apos;t wired up yet.
          </p>
        ) : null}
        <AuthField
          label="Email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
        />
        <AuthField
          label="Password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
        <Button
          type="submit"
          disabled={pending}
          className="mt-2 h-11 rounded-full text-sm"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  )
}

export const Route = createFileRoute('/login')({ component: LoginPage })
