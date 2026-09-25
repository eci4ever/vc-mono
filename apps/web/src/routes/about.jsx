import { Fragment } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AppShell } from '@/components/app-shell'

const stack = [
  {
    area: 'API',
    detail: 'Go Fiber under /api/v1, PostgreSQL via sqlc, structured slog JSON logs.',
  },
  {
    area: 'Web',
    detail: 'React + Vite, TanStack Router (file-based routes), TanStack Query, shadcn/ui on Base UI.',
  },
  {
    area: 'Deployment',
    detail: 'Single origin on Vercel (sin1) — the React build is embedded into the Go binary.',
  },
]

function About() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">About</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What powers vc-mono.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stack</CardTitle>
            <CardDescription>One repo, one binary, one origin.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {stack.map((item, i) => (
              <Fragment key={item.area}>
                {i > 0 && <Separator />}
                <div className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
                  <Badge variant="secondary" className="w-fit shrink-0">
                    {item.area}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

export const Route = createFileRoute('/about')({ component: About })
