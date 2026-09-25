import { Link } from '@tanstack/react-router'
import { ActivityIcon } from 'lucide-react'
import { cn } from 'cn'

const navLinkClass = ({ isActive }) =>
  cn(
    'rounded-md px-3 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-muted font-medium text-foreground'
      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
  )

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/about', label: 'About' },
]

export function AppShell({ children }) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading text-sm font-semibold tracking-tight"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-linear-to-br from-brand-from to-brand-via text-white">
              <ActivityIcon className="size-3.5" />
            </span>
            vc-mono
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">{children}</main>

      <footer className="mx-auto w-full max-w-2xl px-4 pb-8">
        <p className="text-center text-xs text-muted-foreground">
          Go Fiber · React · single origin on Vercel
        </p>
      </footer>
    </>
  )
}
