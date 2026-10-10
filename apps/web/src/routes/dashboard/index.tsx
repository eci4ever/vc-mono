import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BadgeCheckIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react'

import { StatusPills } from '@/components/landing/status-pills'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { sessionQuery } from '@/lib/auth'

function DashboardOverview() {
  const { data: user } = useQuery(sessionQuery)
  if (!user) return null

  const firstName = user.name.split(/\s+/)[0] ?? user.name

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account is live — this starter is yours to build on.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium">
              <BadgeCheckIcon className="size-4 text-muted-foreground" />
              Account
            </CardTitle>
            <CardDescription>Your signed-in identity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Member since</span>
              <span className="text-sm font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium">
              <ShieldCheckIcon className="size-4 text-muted-foreground" />
              System status
            </CardTitle>
            <CardDescription>Live health of this deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPills />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-medium">
            <SparklesIcon className="size-4 text-muted-foreground" />
            What's included
          </CardTitle>
          <CardDescription>
            The scaffolding this dashboard is standing on
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>
              Session auth in Go — argon2id hashes, httpOnly cookies, and a
              server-side sessions table
            </li>
            <li>
              Role-based access — the first signed-up user becomes
              platform_admin and unlocks the Users admin page
            </li>
            <li>
              Typed SQL via sqlc with versioned migrations — see
              db/migrations and db/query.sql
            </li>
            <li>
              An example CRUD resource at /api/v1/messages, ready to be
              repurposed for your domain
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})
