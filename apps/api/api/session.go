package api

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v3"

	"vc-mono/api/db/sqlc"
)

const (
	sessionCookieName = "vc_session"
	sessionDuration   = 30 * 24 * time.Hour
)

// localsUser is the fiber.Locals key holding the sessionUser.
const localsUser = "session_user"

// RoleAdmin is the platform-level role granted to the first signed-up user.
const RoleAdmin = "platform_admin"

// sessionUser is the authenticated identity attached to a request.
type sessionUser struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

// newSessionToken mints a random 256-bit token. The raw value goes to the
// client; only its SHA-256 is stored server-side.
func newSessionToken() (raw string, id string, err error) {
	buf := make([]byte, 32)
	if _, err = rand.Read(buf); err != nil {
		return "", "", err
	}
	raw = hex.EncodeToString(buf)
	sum := sha256.Sum256([]byte(raw))
	return raw, hex.EncodeToString(sum[:]), nil
}

func hashToken(raw string) string {
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}

// startSession creates a session row and sets the session cookie.
func (s *Server) startSession(c fiber.Ctx, userID string) error {
	raw, id, err := newSessionToken()
	if err != nil {
		return err
	}
	if err := s.queries.CreateSession(c.Context(), sqlc.CreateSessionParams{
		ID:        id,
		UserID:    userID,
		ExpiresAt: time.Now().Add(sessionDuration),
	}); err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     sessionCookieName,
		Value:    raw,
		Path:     "/",
		MaxAge:   int(sessionDuration.Seconds()),
		HTTPOnly: true,
		Secure:   c.Protocol() == "https",
		SameSite: "Lax",
	})
	return nil
}

// currentUser returns the authenticated user for this request, or nil.
func currentUser(c fiber.Ctx) *sessionUser {
	user, _ := c.Locals(localsUser).(*sessionUser)
	return user
}

// loadSession resolves the session cookie into a user, if any. It is
// non-fatal: an absent or expired session just means no user.
func (s *Server) loadSession(c fiber.Ctx) {
	raw := c.Cookies(sessionCookieName)
	if raw == "" || s.queries == nil {
		return
	}
	row, err := s.queries.GetSession(c.Context(), hashToken(raw))
	if err != nil {
		return // unknown or expired session
	}
	c.Locals(localsUser, &sessionUser{
		ID:        row.UserID,
		Name:      row.Name,
		Email:     row.Email,
		Role:      row.Role,
		CreatedAt: row.UserCreatedAt,
	})
}

// requireAuth rejects unauthenticated requests with 401.
func (s *Server) requireAuth(c fiber.Ctx) error {
	if currentUser(c) == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "authentication required")
	}
	return c.Next()
}

// requireAdmin rejects non-admin requests with 403.
func (s *Server) requireAdmin(c fiber.Ctx) error {
	user := currentUser(c)
	if user == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "authentication required")
	}
	if user.Role != RoleAdmin {
		return fiber.NewError(fiber.StatusForbidden, "admin access required")
	}
	return c.Next()
}

// destroySession deletes the session row and clears the cookie. Missing
// cookie or unknown session is not an error.
func (s *Server) destroySession(c fiber.Ctx) error {
	if raw := c.Cookies(sessionCookieName); raw != "" && s.queries != nil {
		if err := s.queries.DeleteSession(c.Context(), hashToken(raw)); err != nil {
			s.log.Warn("delete session failed", slog.String("error", err.Error()))
		}
	}
	c.Cookie(&fiber.Cookie{
		Name:     sessionCookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HTTPOnly: true,
		Secure:   c.Protocol() == "https",
		SameSite: "Lax",
	})
	return nil
}

var errNoQueries = errors.New("database not configured")
