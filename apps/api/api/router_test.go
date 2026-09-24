package api

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v3"
)

func newTestApp() *fiber.App {
	return New(slog.New(slog.NewTextHandler(io.Discard, nil)), nil)
}

func request(t *testing.T, app *fiber.App, method, path, body string) (int, string) {
	t.Helper()

	var reader io.Reader
	if body != "" {
		reader = strings.NewReader(body)
	}
	req := httptest.NewRequest(method, path, reader)
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("%s %s: %v", method, path, err)
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("read body: %v", err)
	}
	return resp.StatusCode, string(raw)
}

func TestHello(t *testing.T) {
	status, body := request(t, newTestApp(), http.MethodGet, "/api/v1/hello", "")
	if status != http.StatusOK {
		t.Fatalf("status = %d, want 200", status)
	}
	if !strings.Contains(body, "Hello, World!") {
		t.Fatalf("body = %q", body)
	}
}

func TestStatusWithoutDatabase(t *testing.T) {
	status, body := request(t, newTestApp(), http.MethodGet, "/api/v1/status", "")
	if status != http.StatusOK {
		t.Fatalf("status = %d, want 200", status)
	}
	if !strings.Contains(body, "not_configured") {
		t.Fatalf("body = %q", body)
	}
}

func TestUnknownAPIRouteReturnsJSON404(t *testing.T) {
	status, body := request(t, newTestApp(), http.MethodGet, "/api/v1/nope", "")
	if status != http.StatusNotFound {
		t.Fatalf("status = %d, want 404", status)
	}
	if !strings.Contains(body, "not found") {
		t.Fatalf("body = %q", body)
	}
}

func TestListMessagesWithoutDatabase(t *testing.T) {
	status, _ := request(t, newTestApp(), http.MethodGet, "/api/v1/messages", "")
	if status != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want 503", status)
	}
}

func TestCreateMessageValidation(t *testing.T) {
	cases := []struct {
		name string
		body string
		want int
	}{
		{"missing content", `{}`, http.StatusBadRequest},
		{"blank content", `{"content":"   "}`, http.StatusBadRequest},
		{"invalid json", `{`, http.StatusBadRequest},
		{"valid body, no database", `{"content":"hi"}`, http.StatusServiceUnavailable},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			status, _ := request(t, newTestApp(), http.MethodPost, "/api/v1/messages", tc.body)
			if status != tc.want {
				t.Fatalf("status = %d, want %d", status, tc.want)
			}
		})
	}
}
