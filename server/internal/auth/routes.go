package auth

import "github.com/labstack/echo/v4"

// Register mounts auth routes onto the given echo group.
func Register(g *echo.Group, svc *Service) {
	h := NewHandler(svc)

	g.POST("/auth/login", h.Login)
}
