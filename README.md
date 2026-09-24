# vc-mono

Go Fiber API + React (Vite) web app in one repo, deployed as a **single origin**
on Vercel: the React build is embedded into the Go binary, so one server serves
both the API and the frontend.

```
.
├── main.go                 # entrypoint (root module, required by the Vercel Go runtime)
├── go.work                 # workspace: "." + "./apps/api"
├── apps
│   ├── api                 # Go module: vc-mono/api
│   │   ├── api             # routes, middleware, handlers (+ tests)
│   │   ├── config          # env + .env loading
│   │   ├── db              # pool, migrations, SQL; sqlc/ is generated
│   │   ├── webfs           # go:embed of the built web app
│   │   └── cmd/migrate     # versioned migration runner
│   └── web                 # React app (npm workspace: @vc-mono/web)
├── package.json            # npm workspace root
├── sqlc.yaml
└── vercel.json
```

The root module is a thin shim: Vercel's Go preset only detects entrypoints at
the project root (`main.go`, `cmd/api/main.go`, `cmd/server/main.go`), so the
server entrypoint lives there while all application code stays in `apps/api`.

## Requirements

- Go 1.27+
- Node 20+
- [sqlc](https://sqlc.dev) 1.31+ (only when changing SQL)
- A Postgres database (this project uses Neon)

## Setup

```sh
cp .env.example .env     # then fill in DATABASE_URL
npm install              # installs the web workspace
make migrate             # apply migrations
```

## Development

Two terminals:

```sh
make run        # API + built SPA on http://localhost:3000
make dev-web    # Vite dev server on http://localhost:5173 (proxies /api)
```

## Common commands

```
make help       # list all targets
make web        # build the React app into the Go embed directory
make build      # build the API binary with the web app embedded
make test       # run Go tests
make migrate    # apply database migrations
make tidy       # go mod tidy + sqlc generate
make deploy     # deploy to Vercel (production)
```

## API

All JSON routes are versioned under `/api/v1`:

| Method | Path               | Description                           |
| ------ | ------------------ | ------------------------------------- |
| GET    | `/api/v1/hello`    | Hello world                           |
| GET    | `/api/v1/status`   | API uptime + database status/latency  |
| GET    | `/api/v1/messages` | List the 50 most recent messages      |
| POST   | `/api/v1/messages` | Create a message `{"content":"…"}`    |

Responses are typed structs; errors are always `{"error": "…"}`. Every request
is logged as one structured JSON line (`slog`) with a `request_id`.

## Database

- SQL lives in `apps/api/db`: `query.sql` (sqlc input) and `migrations/`.
- `sqlc generate` writes the query code to `apps/api/db/sqlc` (generated code is
  kept separate from the hand-written `db` package).
- Migrations are versioned and tracked in `schema_migrations`:

```sh
# add apps/api/db/migrations/0002_something.sql, then
make migrate
```

## Deployment

`vercel.json` builds the web app, copies it into the Go embed directory and
builds the API binary for the `sin1` (Singapore) region.

```sh
# value only (not the KEY=value line from .env)
grep '^DATABASE_URL=' .env | cut -d= -f2- | vercel env add DATABASE_URL production
make deploy
```
