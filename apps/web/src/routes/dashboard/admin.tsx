import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions } from '@tanstack/react-query'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ROLE_ADMIN, sessionQuery } from '@/lib/auth'
import { usePageTitle } from '@/lib/use-page-title'

type AdminUser = {
  id: string
  name: string
  email: string
  role: 'user' | 'platform_admin'
  created_at: string
}

const adminUsersQuery = queryOptions({
  queryKey: ['admin', 'users'],
  queryFn: async (): Promise<AdminUser[]> => {
    const res = await fetch('/api/v1/admin/users')
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error ?? `HTTP ${res.status}`)
    }
    return res.json() as Promise<AdminUser[]>
  },
})

function AdminUsers() {
  usePageTitle('Admin · Users')
  const { data: user } = useQuery(sessionQuery)

  // Server enforces the same rule with a 403; this only shapes the UI.
  if (user && user.role !== ROLE_ADMIN) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Admin access required</AlertTitle>
        <AlertDescription>
          Your account doesn't have permission to view this page.
        </AlertDescription>
      </Alert>
    )
  }

  return <AdminUsersTable />
}

function AdminUsersTable() {
  const users = useQuery(adminUsersQuery)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Admin · Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone with an account on this deployment, newest first.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            Roles are assigned at signup: the first account is platform_admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.isPending ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : users.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Failed to load users</AlertTitle>
              <AlertDescription>
                {users.error instanceof Error ? users.error.message : 'Something went wrong.'}
              </AlertDescription>
            </Alert>
          ) : users.data.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No users yet.
            </p>
          ) : (
            <div className="flex flex-col">
              {users.data.map((u, i) => (
                <div key={u.id}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant={u.role === ROLE_ADMIN ? 'default' : 'secondary'}>
                        {u.role}
                      </Badge>
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        joined {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/admin')({
  component: AdminUsers,
})
