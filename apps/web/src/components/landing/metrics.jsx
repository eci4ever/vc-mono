import { Container } from '@/components/landing/section'

const metrics = [
  { value: '12ms', label: 'API p50 latency, Fiber on fasthttp' },
  { value: '1', label: 'Binary serving API + frontend' },
  { value: '0', label: 'CORS configs to maintain' },
  { value: '50', label: 'Lines to your first production deploy' },
]

export function Metrics() {
  return (
    <Container>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="h-1 bg-linear-to-r from-brand-from via-brand-via to-brand-to" />
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              className={
                'flex flex-col gap-1 p-6 sm:p-8 ' +
                (i > 0 ? 'border-l border-border/70 ' : '') +
                (i === 2 ? 'max-lg:border-l-0 max-lg:border-t ' : '') +
                (i === 3 ? 'max-lg:border-t ' : '') +
                (i === 1 ? 'max-lg:border-t-0 ' : '')
              }
            >
              <dt className="order-2 text-sm text-muted-foreground">
                {metric.label}
              </dt>
              <dd className="order-1 font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                <span className="text-gradient">{metric.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  )
}
