import { createFileRoute } from '@tanstack/react-router'
import { card } from '../ui'

function About() {
  return (
    <main>
      <h1 style={{ textAlign: 'center' }}>About</h1>
      <div style={{ ...card, display: 'block', textAlign: 'left', lineHeight: 1.7 }}>
        <p>
          <strong>vc-mono</strong> is a monorepo where the Go Fiber API and the React
          web app are built into a single binary and served from one origin.
        </p>
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>
            <strong>API</strong> — Go Fiber under <code>/api/v1</code>, PostgreSQL via
            sqlc, deployed to Vercel (region sin1).
          </li>
          <li>
            <strong>Web</strong> — React + Vite, TanStack Router (file-based routes),
            TanStack Query for server state, embedded into the Go binary.
          </li>
          <li>
            <strong>Single origin</strong> — no CORS: the API and the SPA share the
            same domain.
          </li>
        </ul>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/about')({ component: About })
