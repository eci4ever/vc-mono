// Package db holds the hand-written database layer (pool, migrations).
// The sqlc-generated query code lives in the sibling sqlc package.
package db

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"vc-mono/api/db/sqlc"
)

// Pool is a pgx connection pool.
type Pool = pgxpool.Pool

// Queries is the sqlc-generated query set.
type Queries = sqlc.Queries

// Connect opens a connection pool for the given DSN.
func Connect(ctx context.Context, dsn string) (*Pool, error) {
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL is empty")
	}

	u, err := url.Parse(dsn)
	if err != nil {
		return nil, fmt.Errorf("invalid DATABASE_URL: %w", err)
	}
	q := u.Query()
	// Neon's PgBouncer pooler does not support pgx prepared statements.
	q.Set("default_query_exec_mode", "simple_protocol")
	// Keep the per-instance pool small in serverless environments.
	if q.Get("pool_max_conns") == "" {
		q.Set("pool_max_conns", "3")
	}
	u.RawQuery = q.Encode()

	cfg, err := pgxpool.ParseConfig(u.String())
	if err != nil {
		return nil, err
	}
	cfg.MaxConnIdleTime = 5 * time.Minute

	return pgxpool.NewWithConfig(ctx, cfg)
}

// NewQueries returns the sqlc query set bound to the pool.
func NewQueries(pool *Pool) *Queries {
	return sqlc.New(pool)
}
