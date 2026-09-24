import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { page } from '../ui'

const nav = {
  display: 'flex',
  gap: 20,
  justifyContent: 'center',
  padding: '0.25rem 0 1.5rem',
}

const link = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 600,
}

function RootLayout() {
  return (
    <div style={page}>
      <nav style={nav}>
        <Link to="/" style={link} activeProps={{ style: { ...link, color: '#111827' } }}>
          Home
        </Link>
        <Link to="/about" style={link} activeProps={{ style: { ...link, color: '#111827' } }}>
          About
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
