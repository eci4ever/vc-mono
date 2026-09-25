import { createRootRoute, Outlet } from '@tanstack/react-router'

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
