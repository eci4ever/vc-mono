import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

const STATUS_POLL_MS = 30_000

type DbStatus = {
  status: 'up' | 'down' | 'not_configured'
  latency_ms?: number
  error?: string
}

type StatusResponse = {
  status: string
  uptime: string
  db: DbStatus
}

type StatusState = {
  state: 'up' | 'down' | 'idle'
  detail: string
}

async function fetchStatus(): Promise<StatusResponse & { apiLatencyMs: number }> {
  const startedAt = performance.now()
  const res = await fetch('/api/v1/status')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as StatusResponse
  return { ...data, apiLatencyMs: Math.round(performance.now() - startedAt) }
}

const TONES = {
  up: { pill: 'border-success/30 text-success', dot: 'bg-success' },
  down: { pill: 'border-destructive/30 text-destructive', dot: 'bg-destructive' },
  idle: {
    pill: 'border-border text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
} satisfies Record<StatusState['state'], { pill: string; dot: string }>

function StatusPill({ label, state, detail }: { label: string } & StatusState) {
  const tone = TONES[state]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        tone.pill,
      )}
    >
      <span className="relative flex size-2">
        {state !== 'idle' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
              tone.dot,
            )}
          />
        )}
        <span
          className={cn('relative inline-flex size-2 rounded-full', tone.dot)}
        />
      </span>
      {label} {detail}
    </span>
  )
}

/** Live API + database health, polled from the Go API every 30 seconds. */
export function StatusPills() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: STATUS_POLL_MS,
  })

  const db = data?.db

  const api: StatusState = isError
    ? { state: 'down', detail: 'offline' }
    : isPending
      ? { state: 'idle', detail: 'checking…' }
      : { state: 'up', detail: `operational · ${data.apiLatencyMs}ms` }

  let dbPill: StatusState
  if (isPending) dbPill = { state: 'idle', detail: 'checking…' }
  else if (isError) dbPill = { state: 'down', detail: 'offline' }
  else if (db?.status === 'up')
    dbPill = { state: 'up', detail: `operational · ${db.latency_ms}ms` }
  else if (db?.status === 'down') dbPill = { state: 'down', detail: 'offline' }
  else dbPill = { state: 'idle', detail: 'not configured' }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <StatusPill label="API" {...api} />
      <StatusPill label="DB" {...dbPill} />
    </div>
  )
}
