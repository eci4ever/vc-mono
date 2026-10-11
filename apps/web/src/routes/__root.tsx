import type { QueryClient } from '@tanstack/react-query'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/lib/use-page-title'

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md"
      >
        Skip to content
      </a>
      <Outlet />
    </div>
  )
}

function NotFound() {
  usePageTitle('Page not found')
  return (
    <div
      id="main"
      className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-3xl font-semibold tracking-tighter text-balance">
        Nothing here
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        That page doesn&apos;t exist.
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
