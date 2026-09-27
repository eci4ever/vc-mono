import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { AuthField, AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'

function SignupPage() {
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    // Mock: pretend to create the account, nothing is sent anywhere.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setPending(false)
    setSubmitted(true)
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start free. No credit card required."
      footer={
        <>
          Have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
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
          label="Name"
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Ada Lovelace"
        />
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
          minLength={8}
          autoComplete="new-password"
          placeholder="8+ characters"
        />
        <Button
          type="submit"
          disabled={pending}
          className="mt-2 h-11 rounded-full text-sm"
        >
          {pending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}

export const Route = createFileRoute('/signup')({ component: SignupPage })
