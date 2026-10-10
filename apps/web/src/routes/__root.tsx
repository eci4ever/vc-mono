import type { QueryClient } from '@tanstack/react-query'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { BRAND_NAME } from '@/lib/brand'

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Outlet />
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-3xl font-semibold tracking-tighter text-balance">
        Nothing here
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {BRAND_NAME} is a single landing page for now.
      </p>
      <Button
        nativeButton={false}
        render={<Link to="/" />}
        className="h-10 rounded-full px-5"
      >
        Back to the landing page
      </Button>
    </div>
  )
}

type RouterContext = {
  queryClient: QueryClient
}

function RootError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">Something broke</h1>
      <pre className="max-w-xl overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-muted-foreground">
        {message}
      </pre>
      <Button
        nativeButton={false}
        render={<Link to="/" />}
        className="h-10 rounded-full px-5"
      >
        Back to the landing page
      </Button>
    </div>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RootError,
})
