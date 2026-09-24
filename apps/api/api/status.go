package api

import (
	"time"

	"github.com/gofiber/fiber/v3"
)

var startedAt = time.Now()

type dbStatus struct {
	Status    string `json:"status"`
	LatencyMS *int64 `json:"latency_ms,omitempty"`
	Error     string `json:"error,omitempty"`
}

type statusResponse struct {
	Status string   `json:"status"`
	Uptime string   `json:"uptime"`
	DB     dbStatus `json:"db"`
}

func (s *Server) status(c fiber.Ctx) error {
	resp := statusResponse{
		Status: "ok",
		Uptime: time.Since(startedAt).Round(time.Second).String(),
		DB:     dbStatus{Status: "not_configured"},
	}

	if s.pool != nil {
		t0 := time.Now()
		if err := s.pool.Ping(c.Context()); err != nil {
			resp.DB = dbStatus{Status: "down", Error: err.Error()}
		} else {
			ms := time.Since(t0).Milliseconds()
			resp.DB = dbStatus{Status: "up", LatencyMS: &ms}
		}
	}

	return c.JSON(resp)
}
