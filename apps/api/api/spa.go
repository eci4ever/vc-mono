package api

import (
	"io/fs"

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

	index := static.New("index.html", static.Config{FS: dist})
	app.Use("/", static.New("/", static.Config{
		FS: dist,
		NotFoundHandler: func(c fiber.Ctx) error {
			if _, statErr := fs.Stat(dist, "index.html"); statErr != nil {
				return c.Status(fiber.StatusServiceUnavailable).
					SendString("Frontend not built. Run: make web")
			}
			return index(c)
		},
	}))
}
