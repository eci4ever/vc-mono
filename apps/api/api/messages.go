package api

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
)

type messageResponse struct {
	ID        int64     `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type createMessageRequest struct {
	Content string `json:"content"`
}

func (s *Server) listMessages(c fiber.Ctx) error {
	if s.queries == nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "database not configured")
	}

	msgs, err := s.queries.ListMessages(c.Context())
	if err != nil {
		s.log.Error("list messages failed", "error", err)
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}

	out := make([]messageResponse, len(msgs))
	for i, m := range msgs {
		out[i] = messageResponse{ID: m.ID, Content: m.Content, CreatedAt: m.CreatedAt}
	}
	return c.JSON(out)
}

func (s *Server) createMessage(c fiber.Ctx) error {
	var req createMessageRequest
	if err := c.Bind().Body(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	content := strings.TrimSpace(req.Content)
	if content == "" {
		return fiber.NewError(fiber.StatusBadRequest, "content is required")
	}
	if len(content) > 500 {
		return fiber.NewError(fiber.StatusBadRequest, "content must be 500 characters or less")
	}

	if s.queries == nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "database not configured")
	}

	msg, err := s.queries.CreateMessage(c.Context(), content)
	if err != nil {
		s.log.Error("create message failed", "error", err)
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	return c.Status(fiber.StatusCreated).JSON(messageResponse{
		ID:        msg.ID,
		Content:   msg.Content,
		CreatedAt: msg.CreatedAt,
	})
}
