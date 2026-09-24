import { useCallback, useEffect, useState } from 'react'

const API = '/api/v1'

const card = {
  display: 'inline-block',
  padding: '1rem 1.5rem',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}

const dot = (color) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: color,
  display: 'inline-block',
})

export default function App() {
  const [status, setStatus] = useState('checking')
  const [latency, setLatency] = useState(null)
  const [db, setDb] = useState({ status: 'checking', latency: null })
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [postError, setPostError] = useState('')

  const check = useCallback(() => {
    setStatus('checking')
    setDb((d) => ({ ...d, status: 'checking' }))
    const t0 = performance.now()
    fetch(`${API}/status`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status)
        return res.json()
      })
      .then((data) => {
        setStatus('online')
        setLatency(Math.round(performance.now() - t0))
        setDb({
          status: data.db?.status ?? 'unknown',
          latency: data.db?.latency_ms ?? null,
          error: data.db?.error,
        })
      })
      .catch(() => {
        setStatus('offline')
        setLatency(null)
        setDb({ status: 'unknown', latency: null })
      })
  }, [])

  const loadMessages = useCallback(() => {
    fetch(`${API}/messages`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setMessages)
      .catch(() => setMessages([]))
  }, [])

  useEffect(() => {
    check()
    loadMessages()
    const id = setInterval(check, 10000)
    return () => clearInterval(id)
  }, [check, loadMessages])

  const submit = async (e) => {
    e.preventDefault()
    const content = draft.trim()
    if (!content) return
    setPostError('')
    const res = await fetch(`${API}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setPostError(data?.error ?? `Failed to send (HTTP ${res.status})`)
      return
    }
    setDraft('')
    loadMessages()
  }

  const color =
    status === 'online' ? '#22c55e' : status === 'offline' ? '#ef4444' : '#f59e0b'
  const label =
    status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking…'

  const dbColor =
    db.status === 'up' ? '#22c55e' : db.status === 'down' ? '#ef4444' : '#f59e0b'
  const dbLabel =
    db.status === 'up'
      ? 'Database Up'
      : db.status === 'down'
        ? 'Database Down'
        : db.status === 'not_configured'
          ? 'Database Not Configured'
          : 'Checking DB…'

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>React + Fiber monorepo</h1>
      <div style={{ ...card, display: 'block', textAlign: 'center' }}>
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <span style={dot(color)} />
          <strong>{label}</strong>
          {latency != null && <span style={{ color: '#6b7280' }}>· {latency} ms</span>}
        </p>
      </div>
      <div style={{ ...card, display: 'block', textAlign: 'center', marginTop: 12 }}>
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <span style={dot(dbColor)} />
          <strong>{dbLabel}</strong>
          {db.latency != null && <span style={{ color: '#6b7280' }}>· {db.latency} ms</span>}
        </p>
        {db.status === 'down' && db.error && (
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
        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
          Send
        </button>
      </form>
      {postError && (
        <p style={{ margin: '-0.5rem 0 1rem', color: '#ef4444', fontSize: 14 }} role="alert">
          {postError}
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
        {messages.length === 0 && <li style={{ color: '#9ca3af' }}>No messages yet.</li>}
      </ul>
    </main>
  )
}
