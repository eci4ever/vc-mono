import { Link, Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOutIcon } from 'lucide-react'

import { BrandMark } from '@/components/landing/brand-mark'
import { Button } from '@/components/ui/button'
import { authApi, sessionQuery } from '@/lib/auth'
import { cn } from '@/lib/utils'

/**
 * Guarded dashboard layout. beforeLoad shares the session query through the
 * router context's query client and bounces guests to /login; the component
 * reads the same cached session itself.
 */
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(sessionQuery)
    if (!user) throw redirect({ to: '/login' })
  },
  component: DashboardLayout,
})

const navLink =
  'block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground'
const navLinkActive = 'bg-muted font-medium text-foreground'

function DashboardLayout() {
  const { data: user } = useQuery(sessionQuery)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      queryClient.setQueryData(sessionQuery.queryKey, null)
      queryClient.invalidateQueries()
      await navigate({ to: '/' })
    },
  })

  if (!user) return null

  const initials = user.name
    .split(/\s+/)
    .map((part: string) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r sm:flex">
        <div className="flex h-16 items-center border-b px-5">
          <BrandMark />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            activeProps={{ className: navLinkActive }}
            className={navLink}
          >
            Overview
          </Link>
          <Link
            to="/dashboard/settings"
            activeProps={{ className: navLinkActive }}
            className={navLink}
          >
            Settings
          </Link>
          {user.role === 'platform_admin' && (
            <>
              <p className="mt-4 px-3 pb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Admin
              </p>
              <Link
                to="/dashboard/admin"
                activeProps={{ className: navLinkActive }}
                className={navLink}
              >
                Users
              </Link>
            </>
          )}
        </nav>
        <div className="border-t p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-foreground to-foreground/55 text-xs font-medium text-background">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Sign out"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              <LogOutIcon />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur sm:hidden">
          <BrandMark />
          <div className="flex items-center gap-1">
            <Link
              to="/dashboard"
              activeOptions={{ exact: true }}
              activeProps={{ className: navLinkActive }}
              className={cn(navLink, 'px-2 py-1.5 text-xs')}
            >
              Overview
            </Link>
            <Link
              to="/dashboard/settings"
              activeProps={{ className: navLinkActive }}
              className={cn(navLink, 'px-2 py-1.5 text-xs')}
            >
              Settings
            </Link>
            {user.role === 'platform_admin' && (
              <Link
                to="/dashboard/admin"
                activeProps={{ className: navLinkActive }}
                className={cn(navLink, 'px-2 py-1.5 text-xs')}
              >
                Admin
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Sign out"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              <LogOutIcon />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
