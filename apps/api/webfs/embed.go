// Package webfs embeds the built React app (apps/web/dist) into the Go binary,
// which is what makes the API and web app share a single origin.
package webfs

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var dist embed.FS

// FS returns the embedded web build as an fs.FS rooted at dist/.
func FS() (fs.FS, error) {
	return fs.Sub(dist, "dist")
}
