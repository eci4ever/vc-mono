// Package api wires the HTTP layer: Fiber routes, middleware and the SPA.
package api

import (
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/compress"
	"github.com/gofiber/fiber/v3/middleware/helmet"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/gofiber/fiber/v3/middleware/recover"

	"vc-mono/api/db"
)

// Server holds the dependencies used by the HTTP handlers.
type Server struct {
	log     *slog.Logger
	pool    *db.Pool
	queries *db.Queries
}

// New builds the Fiber app: the versioned API under /api/v1 and the SPA at /.
// pool may be nil, in which case database-backed routes return 503.
func New(log *slog.Logger, pool *db.Pool) *fiber.App {
	s := &Server{log: log, pool: pool}
	if pool != nil {
		s.queries = db.NewQueries(pool)
	}

	app := fiber.New(fiber.Config{
		AppName:      "vc-mono",
		ErrorHandler: errorHandler,
	})

	// Logger first (outermost) so panics recovered below are still logged.
	app.Use(requestLogger(log))
	app.Use(recover.New())
	app.Use(helmet.New())
	app.Use(compress.New())

	// Resolve the session cookie (if any) before routing.
	app.Use(func(c fiber.Ctx) error {
		s.loadSession(c)
		return c.Next()
	})

	// Rate-limit unauthenticated writes: these endpoints are public.
	writeLimiter := limiter.New(limiter.Config{
		Max:        10,
		Expiration: time.Minute,
	})

	v1 := app.Group("/api/v1")
	v1.Get("/hello", s.hello)
	v1.Get("/status", s.status)
	v1.Get("/messages", s.listMessages)
	v1.Post("/messages", writeLimiter, s.createMessage)

	auth := v1.Group("/auth")
	auth.Post("/signup", writeLimiter, s.signup)
	auth.Post("/login", writeLimiter, s.login)
	auth.Post("/logout", s.logout)
	auth.Get("/me", s.me)
	auth.Put("/me", s.requireAuth, s.updateMe)

	v1.Get("/admin/users", s.requireAdmin, s.adminListUsers)

	// Unknown API routes -> JSON 404, never the SPA fallback.
	app.Use("/api", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(errorResponse{Error: "not found"})
	})

	mountSPA(app)

	return app
}

type errorResponse struct {
	Error string `json:"error"`
}

func errorHandler(c fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(errorResponse{Error: err.Error()})
}
