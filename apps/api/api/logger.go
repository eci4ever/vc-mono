package api

import (
	"crypto/rand"
	"encoding/hex"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v3"
)

// requestLogger emits one structured JSON log line per request.
func requestLogger(log *slog.Logger) fiber.Handler {
	return func(c fiber.Ctx) error {
		requestID := c.Get(fiber.HeaderXRequestID)
		if requestID == "" {
			requestID = newRequestID()
			c.Set(fiber.HeaderXRequestID, requestID)
		}

		start := time.Now()
		err := c.Next()

		status := c.Response().StatusCode()
		if err != nil {
			// The error handler has not run yet, so resolve the real status here.
			status = fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				status = e.Code
			}
		}

		attrs := []any{
			slog.String("request_id", requestID),
			slog.String("method", c.Method()),
			slog.String("path", c.Path()),
			slog.Int("status", status),
			slog.Int64("duration_ms", time.Since(start).Milliseconds()),
			slog.String("ip", c.IP()),
		}
		if err != nil {
			attrs = append(attrs, slog.String("error", err.Error()))
			log.Error("http_request", attrs...)
			return err
		}
		log.Info("http_request", attrs...)
		return nil
	}
}

func newRequestID() string {
	var b [8]byte
	_, _ = rand.Read(b[:])
	return hex.EncodeToString(b[:])
}
