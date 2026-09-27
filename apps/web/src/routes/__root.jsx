import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
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

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})
