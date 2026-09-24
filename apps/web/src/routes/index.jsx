import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { card, dot, statusRow } from '../ui'

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

function Home() {
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

  const status = statusQuery.isError
    ? 'offline'
    : statusQuery.isPending
      ? 'checking'
      : 'online'
  const color = status === 'online' ? '#22c55e' : status === 'offline' ? '#ef4444' : '#f59e0b'
  const label = status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking…'

  const db = statusQuery.data?.db
  const dbStatus = statusQuery.isError ? 'unknown' : (db?.status ?? 'checking')
  const dbColor = dbStatus === 'up' ? '#22c55e' : dbStatus === 'down' ? '#ef4444' : '#f59e0b'
  const dbLabel =
    dbStatus === 'up'
      ? 'Database Up'
      : dbStatus === 'down'
        ? 'Database Down'
        : dbStatus === 'not_configured'
          ? 'Database Not Configured'
          : dbStatus === 'unknown'
            ? 'Database Unknown'
            : 'Checking DB…'

  const messages = messagesQuery.data ?? []

  const submit = (e) => {
    e.preventDefault()
    const content = draft.trim()
    if (!content || createMessage.isPending) return
    createMessage.mutate(content)
  }

  return (
    <main>
      <h1 style={{ textAlign: 'center' }}>React + Fiber monorepo</h1>
      <div style={{ ...card, display: 'block', textAlign: 'center' }}>
        <p style={statusRow}>
          <span style={dot(color)} />
          <strong>{label}</strong>
          {statusQuery.data && <span style={{ color: '#6b7280' }}>· {statusQuery.data.apiLatency} ms</span>}
        </p>
      </div>
      <div style={{ ...card, display: 'block', textAlign: 'center', marginTop: 12 }}>
        <p style={statusRow}>
          <span style={dot(dbColor)} />
          <strong>{dbLabel}</strong>
          {db?.latency_ms != null && <span style={{ color: '#6b7280' }}>· {db.latency_ms} ms</span>}
        </p>
        {dbStatus === 'down' && db?.error && (
          <p style={{ margin: '8px 0 0', color: '#ef4444', fontSize: 13 }}>{db.error}</p>
        )}
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: 8, margin: '1.5rem 0' }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message…"
          style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <button
          type="submit"
          disabled={createMessage.isPending}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            cursor: createMessage.isPending ? 'wait' : 'pointer',
            opacity: createMessage.isPending ? 0.6 : 1,
          }}
        >
          {createMessage.isPending ? 'Sending…' : 'Send'}
        </button>
      </form>
      {createMessage.isError && (
        <p style={{ margin: '-0.5rem 0 1rem', color: '#ef4444', fontSize: 14 }} role="alert">
          {createMessage.error.message}
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
        {messages.map((m) => (
          <li key={m.id} style={{ ...card, display: 'block', textAlign: 'left' }}>
            {m.content}
            <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>
              {new Date(m.created_at).toLocaleString()}
            </div>
          </li>
        ))}
        {messagesQuery.isPending && <li style={{ color: '#9ca3af' }}>Loading…</li>}
        {messagesQuery.isError && <li style={{ color: '#ef4444' }}>Failed to load messages.</li>}
        {!messagesQuery.isPending && !messagesQuery.isError && messages.length === 0 && (
          <li style={{ color: '#9ca3af' }}>No messages yet.</li>
        )}
      </ul>
    </main>
  )
}

export const Route = createFileRoute('/')({ component: Home })
