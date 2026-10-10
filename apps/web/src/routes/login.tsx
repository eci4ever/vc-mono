import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { AuthField, AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { authApi, sessionQuery } from '@/lib/auth'

function LoginPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (user) => {
      queryClient.setQueryData(sessionQuery.queryKey, user)
      await navigate({ to: '/dashboard' })
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    },
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    login.mutate({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    })
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
        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
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
          disabled={login.isPending}
          className="mt-2 h-11 rounded-full text-sm"
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  )
}

export const Route = createFileRoute('/login')({ component: LoginPage })
