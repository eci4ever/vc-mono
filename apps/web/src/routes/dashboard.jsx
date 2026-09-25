import { Fragment, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DatabaseIcon,
  InboxIcon,
  RefreshCwIcon,
  SendIcon,
  ServerIcon,
} from 'lucide-react'
import { cn } from 'cn'

import { AppShell } from '@/components/app-shell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

const API = '/api/v1'

async function fetchStatus() {
  const t0 = performance.now()
  const res = await fetch(`${API}/status`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return { ...data, apiLatency: Math.round(performance.now() - t0) }
}

async function fetchMessages() {
  const res = await fetch(`${API}/messages`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function StateBadge({ state, labels }) {
  const dot =
    state === 'up' ? 'bg-success' : state === 'down' ? 'bg-destructive' : 'bg-warning'
  const label = labels[state] ?? labels.checking
  return (
    <Badge variant="outline" className="gap-1.5">
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label}
    </Badge>
  )
}

function Latency({ pending, ms, suffix }) {
  if (pending) return <Skeleton className="h-8 w-24" />
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-heading text-3xl font-semibold tabular-nums">
        {ms ?? '—'}
      </span>
      <span className="text-xs text-muted-foreground">{suffix}</span>
    </div>
  )
}

function StatusCard({ icon: Icon, title, description, action, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>{action}</CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Dashboard() {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')

  const statusQuery = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: 10000,
  })

  const messagesQuery = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  })

  const createMessage = useMutation({
    mutationFn: async (content) => {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? `Failed to send (HTTP ${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      setDraft('')
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const apiState = statusQuery.isError
    ? 'down'
    : statusQuery.isPending
      ? 'pending'
      : 'up'
  const db = statusQuery.data?.db
  const dbState = statusQuery.isError
    ? 'unknown'
    : statusQuery.isPending
      ? 'pending'
      : (db?.status === 'up' ? 'up' : db?.status === 'down' ? 'down' : 'pending')

  const messages = messagesQuery.data ?? []
  const pending = createMessage.isPending

  const submit = (e) => {
    e.preventDefault()
    const content = draft.trim()
    if (!content || pending) return
    createMessage.mutate(content)
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live health of the API and its database — refreshes every 10 seconds.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatusCard
            icon={ServerIcon}
            title="API"
            description="GET /api/v1/status · fiber · sin1"
            action={
              statusQuery.isPending ? (
                <Skeleton className="h-5 w-16 rounded-full" />
              ) : (
                <StateBadge
                  state={apiState}
                  labels={{ up: 'Online', down: 'Offline', pending: 'Checking…' }}
                />
              )
            }
          >
            <Latency
              pending={statusQuery.isPending}
              ms={statusQuery.data?.apiLatency}
              suffix="ms response time"
            />
          </StatusCard>

          <StatusCard
            icon={DatabaseIcon}
            title="Database"
            description="PostgreSQL · Neon · ap-southeast-1"
            action={
              statusQuery.isPending ? (
                <Skeleton className="h-5 w-16 rounded-full" />
              ) : (
                <StateBadge
                  state={dbState}
                  labels={{
                    up: 'Up',
                    down: 'Down',
                    not_configured: 'Not configured',
                    pending: 'Checking…',
                    unknown: 'Unknown',
                  }}
                />
              )
            }
          >
            <Latency pending={statusQuery.isPending} ms={db?.latency_ms} suffix="ms query time" />
            {db?.error && (
              <p className="mt-1 line-clamp-2 text-xs text-destructive">{db.error}</p>
            )}
          </StatusCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Stored in PostgreSQL, latest first</CardDescription>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['messages'] })}
                disabled={messagesQuery.isFetching}
              >
                {messagesQuery.isFetching ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <RefreshCwIcon data-icon="inline-start" />
                )}
                Refresh
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form onSubmit={submit}>
              <InputGroup>
                <InputGroupInput
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  maxLength={500}
                  disabled={pending}
                  aria-invalid={createMessage.isError}
                  aria-label="Message"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="submit"
                    size="icon-xs"
                    aria-label="Send"
                    disabled={!draft.trim() || pending}
                  >
                    {pending ? <Spinner /> : <SendIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>

            {createMessage.isError && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't send your message</AlertTitle>
                <AlertDescription>{createMessage.error.message}</AlertDescription>
              </Alert>
            )}

            {messagesQuery.isPending ? (
              <div className="flex flex-col">
                {[0, 1, 2].map((i) => (
                  <Fragment key={i}>
                    {i > 0 && <Separator />}
                    <div className="flex flex-col gap-2 py-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </Fragment>
                ))}
              </div>
            ) : messagesQuery.isError ? (
              <Alert variant="destructive">
                <AlertTitle>Failed to load messages</AlertTitle>
                <AlertDescription>
                  {messagesQuery.error?.message ?? 'Something went wrong.'}
                </AlertDescription>
              </Alert>
            ) : messages.length === 0 ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <InboxIcon />
                  </EmptyMedia>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyDescription>Be the first — say hello.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ol className="flex flex-col">
                {messages.map((m, i) => (
                  <Fragment key={m.id}>
                    {i > 0 && <Separator />}
                    <li className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm break-words">{m.content}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleString()}
                      </p>
                    </li>
                  </Fragment>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

export const Route = createFileRoute('/dashboard')({ component: Dashboard })
