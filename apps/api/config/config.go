// Package config loads application configuration from the environment,
// falling back to the nearest .env file found upwards from the working dir.
package config

import (
	"os"
	"path/filepath"
	"strings"
)

// Config holds runtime configuration.
type Config struct {
	Port        string
	DatabaseURL string
}

// Load reads configuration from the environment.
func Load() Config {
	env := findDotEnv()

	port := firstNonEmpty(os.Getenv("PORT"), env["PORT"], "3000")
	dsn := firstNonEmpty(os.Getenv("DATABASE_URL"), env["DATABASE_URL"])

	return Config{Port: port, DatabaseURL: dsn}
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if v != "" {
			return v
		}
	}
	return ""
}

// findDotEnv walks up from the working directory looking for a .env file.
func findDotEnv() map[string]string {
	dir, err := os.Getwd()
	if err != nil {
		return nil
	}
	for range 5 {
		if data, err := os.ReadFile(filepath.Join(dir, ".env")); err == nil {
			return parseEnv(string(data))
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return nil
}

func parseEnv(data string) map[string]string {
	out := map[string]string{}
	for _, line := range strings.Split(data, "\n") {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if k, v, ok := strings.Cut(line, "="); ok {
			out[strings.TrimSpace(k)] = strings.TrimSpace(v)
		}
	}
	return out
}
