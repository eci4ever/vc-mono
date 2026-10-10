package api

import (
	"log/slog"
	"net/mail"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"

	"vc-mono/api/db/sqlc"
)

const (
	minPasswordLen = 8
	maxNameLen     = 100
	maxEmailLen    = 254
)

type userResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type credentialsRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func newUserResponse(row sqlc.CreateUserRow) userResponse {
	return userResponse{ID: row.ID, Name: row.Name, Email: row.Email, Role: row.Role, CreatedAt: row.CreatedAt}
}

// validateCredentials checks a signup payload and returns the normalised
// name/email. Returns an empty string and nil error shape via fiber error.
func validateCredentials(name, email, password string) (string, string, *fiber.Error) {
	name = strings.TrimSpace(name)
	email = strings.ToLower(strings.TrimSpace(email))

	if name == "" || len(name) > maxNameLen {
		return "", "", fiber.NewError(fiber.StatusBadRequest, "name is required (max 100 characters)")
	}
	if len(email) > maxEmailLen {
		return "", "", fiber.NewError(fiber.StatusBadRequest, "email is too long")
	}
	if _, err := mail.ParseAddress(email); err != nil || strings.ContainsAny(email, " \t\r\n") {
		return "", "", fiber.NewError(fiber.StatusBadRequest, "a valid email address is required")
	}
	if len(password) < minPasswordLen {
		return "", "", fiber.NewError(fiber.StatusBadRequest, "password must be at least 8 characters")
	}
	if len(password) > 200 {
		return "", "", fiber.NewError(fiber.StatusBadRequest, "password is too long")
	}
	return name, email, nil
}

// signup creates the first user as platform_admin; everyone after is user.
func (s *Server) signup(c fiber.Ctx) error {
	if s.queries == nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "database not configured")
	}

	var req credentialsRequest
	if err := c.Bind().Body(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}
	name, email, ferr := validateCredentials(req.Name, req.Email, req.Password)
	if ferr != nil {
		return ferr
	}

	count, err := s.queries.CountUsers(c.Context())
	if err != nil {
		s.log.Error("count users failed", slog.String("error", err.Error()))
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	role := "user"
	if count == 0 {
		role = RoleAdmin
	}

	hash, err := HashPassword(req.Password)
	if err != nil {
		s.log.Error("hash password failed", slog.String("error", err.Error()))
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}

	row, err := s.queries.CreateUser(c.Context(), sqlc.CreateUserParams{
		Name: name, Email: email, PasswordHash: hash, Role: role,
	})
	if err != nil {
		// Postgres unique_violation — the email is already registered.
		if strings.Contains(err.Error(), "23505") {
			return fiber.NewError(fiber.StatusConflict, "an account with this email already exists")
		}
		s.log.Error("create user failed", slog.String("error", err.Error()))
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}

	if err := s.startSession(c, row.ID); err != nil {
		s.log.Error("start session failed", slog.String("error", err.Error()))
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	return c.Status(fiber.StatusCreated).JSON(userResponse{
		ID: row.ID, Name: row.Name, Email: row.Email, Role: row.Role, CreatedAt: row.CreatedAt,
	})
}

func (s *Server) login(c fiber.Ctx) error {
	if s.queries == nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "database not configured")
	}

	var req credentialsRequest
	if err := c.Bind().Body(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))

	row, err := s.queries.GetUserByEmail(c.Context(), email)
	if err != nil {
		// Same message and status as a bad password: no account enumeration.
		return fiber.NewError(fiber.StatusUnauthorized, "invalid email or password")
	}
	ok, err := VerifyPassword(req.Password, row.PasswordHash)
	if err != nil || !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid email or password")
	}

	if err := s.startSession(c, row.ID); err != nil {
		s.log.Error("start session failed", slog.String("error", err.Error()))
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}

	// Opportunistic cleanup of expired sessions.
	if err := s.queries.DeleteExpiredSessions(c.Context()); err != nil {
		s.log.Warn("delete expired sessions failed", slog.String("error", err.Error()))
	}

	return c.JSON(userResponse{
		ID: row.ID, Name: row.Name, Email: row.Email, Role: row.Role, CreatedAt: row.CreatedAt,
	})
}

func (s *Server) logout(c fiber.Ctx) error {
	if s.queries == nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "database not configured")
	}
	if err := s.destroySession(c); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	return c.JSON(fiber.Map{"ok": true})
}

func (s *Server) me(c fiber.Ctx) error {
	user := currentUser(c)
	if user == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "authentication required")
	}
	return c.JSON(userResponse{
		ID: user.ID, Name: user.Name, Email: user.Email, Role: user.Role, CreatedAt: user.CreatedAt,
	})
}

type updateNameRequest struct {
	Name string `json:"name"`
}

func (s *Server) updateMe(c fiber.Ctx) error {
	if s.queries == nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "database not configured")
	}
	user := currentUser(c)
	if user == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "authentication required")
	}

	var req updateNameRequest
	if err := c.Bind().Body(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}
	name := strings.TrimSpace(req.Name)
	if name == "" || len(name) > maxNameLen {
		return fiber.NewError(fiber.StatusBadRequest, "name is required (max 100 characters)")
	}

	row, err := s.queries.UpdateUserName(c.Context(), sqlc.UpdateUserNameParams{ID: user.ID, Name: name})
	if err != nil {
		s.log.Error("update user failed", slog.String("error", err.Error()))
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	return c.JSON(userResponse{
		ID: row.ID, Name: row.Name, Email: row.Email, Role: row.Role, CreatedAt: row.CreatedAt,
	})
}

type adminUserRow struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

func (s *Server) adminListUsers(c fiber.Ctx) error {
	if s.queries == nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "database not configured")
	}
	rows, err := s.queries.ListUsers(c.Context())
	if err != nil {
		s.log.Error("list users failed", slog.String("error", err.Error()))
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	out := make([]adminUserRow, len(rows))
	for i, r := range rows {
		out[i] = adminUserRow{ID: r.ID, Name: r.Name, Email: r.Email, Role: r.Role, CreatedAt: r.CreatedAt}
	}
	return c.JSON(out)
}
