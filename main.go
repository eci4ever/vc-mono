package main

import (
	"context"
	"log/slog"
	"os"
	"time"

	"vc-mono/api/api"
	"vc-mono/api/config"
	"vc-mono/api/db"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(log)

	cfg := config.Load()

	var pool *db.Pool
	if cfg.DatabaseURL != "" {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		p, err := db.Connect(ctx, cfg.DatabaseURL)
		cancel()
		if err != nil {
			log.Error("database connect failed", "error", err)
			os.Exit(1)
		}
		// pgxpool.New is lazy: ping to fail fast on a bad DSN and warm the pool.
		pingCtx, pingCancel := context.WithTimeout(context.Background(), 5*time.Second)
		err = p.Ping(pingCtx)
		pingCancel()
		if err != nil {
			p.Close()
			log.Error("database ping failed", "error", err)
			os.Exit(1)
		}
		defer p.Close()
		pool = p
		log.Info("database pool ready")
	} else {
		log.Warn("DATABASE_URL is not set - running without a database")
	}

	app := api.New(log, pool)
	log.Info("server starting", "port", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Error("server exited", "error", err)
		os.Exit(1)
	}
}
