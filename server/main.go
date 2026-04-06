package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Create Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Routes
	e.GET("/health", healthCheck)

	// Admin API (Group)
	admin := e.Group("/admin")
	admin.Use(middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
		if username == "admin" && password == "bond" {
			return true, nil
		}
		return false, nil
	}))
	admin.GET("/status", getStatus)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}

// Handler
func healthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"status": "up",
	})
}

func getStatus(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"jamesdsp": "connected",
	})
}
