package api

import (
	"io/fs"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"

	"vc-mono/api/webfs"
)

// mountSPA serves the embedded React build, falling back to index.html for
// client-side routes so the frontend router can handle them.
func mountSPA(app *fiber.App) {
	dist, err := webfs.FS()
	if err != nil {
		panic(err)
	}

	// index.html references hashed assets that change on every deploy, so a
	// stale cached copy points at files that no longer exist and the page
	// renders blank. Force revalidation on everything except /assets, whose
	// content-addressed filenames are safe to cache forever.
	cacheControl := func(c fiber.Ctx) error {
		if strings.HasPrefix(c.Path(), "/assets/") {
			c.Set(fiber.HeaderCacheControl, "public, max-age=31536000, immutable")
		} else {
			c.Set(fiber.HeaderCacheControl, "no-cache")
		}
		return nil
	}
	index := static.New("index.html", static.Config{FS: dist, ModifyResponse: cacheControl})

	app.Use("/", static.New("/", static.Config{
		FS:             dist,
		ModifyResponse: cacheControl,
		NotFoundHandler: func(c fiber.Ctx) error {
			if _, statErr := fs.Stat(dist, "index.html"); statErr != nil {
				return c.Status(fiber.StatusServiceUnavailable).
					SendString("Frontend not built. Run: make web")
			}
			return index(c)
		},
	}))
}
