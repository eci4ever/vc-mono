import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { AuthField, AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { authApi, sessionQuery } from '@/lib/auth'
import { usePageTitle } from '@/lib/use-page-title'

function SignupPage() {
  usePageTitle('Create account')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const signup = useMutation({
    mutationFn: authApi.signup,
    onSuccess: async (user) => {
      queryClient.setQueryData(sessionQuery.queryKey, user)
      await navigate({ to: '/dashboard' })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Sign up failed. Try a different email.')
    },
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    signup.mutate({
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    })
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
        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
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
          disabled={signup.isPending}
          className="mt-2 h-11 rounded-full text-sm"
        >
          {signup.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}

export const Route = createFileRoute('/signup')({ component: SignupPage })
