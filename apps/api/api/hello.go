package api

import "github.com/gofiber/fiber/v3"

type helloResponse struct {
	Message string `json:"message"`
}

func (s *Server) hello(c fiber.Ctx) error {
	return c.JSON(helloResponse{Message: "Hello, World!"})
}
