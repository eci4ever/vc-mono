import { queryOptions } from '@tanstack/react-query'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: 'user' | 'platform_admin'
  created_at: string
}

export const ROLE_ADMIN = 'platform_admin'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body
      ? { 'Content-Type': 'application/json', ...init.headers }
      : init?.headers,
  })
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? `Request failed (HTTP ${res.status})`)
  }
  return res.json() as Promise<T>
}

export const authApi = {
  signup: (input: { name: string; email: string; password: string }) =>
    request<SessionUser>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  login: (input: { email: string; password: string }) =>
    request<SessionUser>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  logout: () => request<{ ok: boolean }>('/api/v1/auth/logout', { method: 'POST' }),

  updateName: (name: string) =>
    request<SessionUser>('/api/v1/auth/me', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
}

/**
 * The authenticated user, or null when signed out. A 401 is an expected
 * response for guests, so it maps to null instead of an error state.
 */
export const sessionQuery = queryOptions({
  queryKey: ['session'],
  queryFn: async (): Promise<SessionUser | null> => {
    const res = await fetch('/api/v1/auth/me')
    if (res.status === 401) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as Promise<SessionUser>
  },
  staleTime: 5 * 60_000,
  retry: false,
})
