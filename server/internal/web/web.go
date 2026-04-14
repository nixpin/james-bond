package web

import (
	"embed"
	"io/fs"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// distFS is the embedded filesystem containing the web client build output.
//
//go:embed dist/*
var distFS embed.FS

// Register mounts the web client handlers onto the given echo instance.
func Register(e *echo.Echo) {
	// Create a sub-filesystem for the dist folder
	content, err := fs.Sub(distFS, "dist")
	if err != nil {
		panic(err)
	}

	// Serve static files
	assetHandler := http.FileServer(http.FS(content))
	e.GET("/*", echo.WrapHandler(assetHandler))

	// Fallback to index.html for SPA (if it's not a file)
	// We use a custom handler to check if the file exists, otherwise serve index.html
	e.HTTPErrorHandler = func(err error, c echo.Context) {
		if he, ok := err.(*echo.HTTPError); ok {
			if he.Code == http.StatusNotFound {
				// Don't fallback for /api routes
				if !strings.HasPrefix(c.Request().URL.Path, "/api") {
					// Serve index.html as fallback
					if data, err := fs.ReadFile(content, "index.html"); err == nil {
						c.Blob(http.StatusOK, "text/html", data)
						return
					}
				}
			}
		}
		e.DefaultHTTPErrorHandler(err, c)
	}
}
