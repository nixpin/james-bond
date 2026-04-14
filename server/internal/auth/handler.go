package auth

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// LoginRequest is the body for POST /api/auth/login.
type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// TokenResponse is returned after a successful login.
type TokenResponse struct {
	Token     string `json:"token"`
	Role      Role   `json:"role"`
	ExpiresAt string `json:"expires_at"`
}

// Handler holds auth HTTP handlers.
type Handler struct {
	svc *Service
}

// NewHandler creates a new auth Handler.
func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

// Login handles POST /api/auth/login.
func (h *Handler) Login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	token, role, err := h.svc.Login(req.Username, req.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
	}

	return c.JSON(http.StatusOK, TokenResponse{
		Token:     token,
		Role:      role,
		ExpiresAt: time.Now().Add(tokenExpiry).UTC().Format(time.RFC3339),
	})
}
