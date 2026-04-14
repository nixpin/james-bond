package auth

import (
	"errors"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

const (
	contextKeyRole     = "role"
	contextKeyUsername = "username"

	errMissingToken = "missing or malformed Authorization header"
	errUnauthorized = "unauthorized"
)

// Middleware returns an Echo middleware that validates JWT tokens.
func Middleware(svc *Service) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			tokenStr, err := extractBearer(c.Request())
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, errMissingToken)
			}

			claims, err := svc.ValidateClaims(tokenStr)
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, errUnauthorized)
			}

			c.Set(contextKeyUsername, claims.Username)
			c.Set(contextKeyRole, string(claims.Role))
			return next(c)
		}
	}
}

// AdminOnly returns an Echo middleware that allows only admin role.
func AdminOnly(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if c.Get(contextKeyRole) != string(RoleAdmin) {
			return echo.NewHTTPError(http.StatusForbidden, "admin access required")
		}
		return next(c)
	}
}

func extractBearer(r *http.Request) (string, error) {
	header := r.Header.Get("Authorization")
	if !strings.HasPrefix(header, "Bearer ") {
		return "", errors.New(errMissingToken)
	}
	return strings.TrimPrefix(header, "Bearer "), nil
}
