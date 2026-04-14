package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/james-bond/dsp-control-server/config"
	"github.com/james-bond/dsp-control-server/internal/auth"
	"github.com/james-bond/dsp-control-server/internal/dsp"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	cfg := config.Load()

	// Structured logger
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	// --- Adapters ---
	dspCLI := dsp.NewCLIClient(cfg.JamesDSPBin)

	// --- Services ---
	authSvc := auth.NewService(cfg)
	dspSvc  := dsp.NewService(dspCLI)

	// --- Middleware ---
	authMW := auth.Middleware(authSvc)

	// --- Router ---
	e := echo.New()
	e.HideBanner = true

	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus: true,
		LogURI:    true,
		LogMethod: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			logger.Info("request",
				slog.String("method", v.Method),
				slog.String("uri", v.URI),
				slog.Int("status", v.Status),
			)
			return nil
		},
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Health check — no auth
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "up"})
	})

	// All API routes
	api := e.Group("/api")
	auth.Register(api, authSvc)
	dsp.Register(api, authMW, dspSvc)

	logger.Info("starting server", slog.String("port", cfg.Port))
	if err := e.Start(cfg.Port); err != nil {
		logger.Error("server stopped", slog.String("error", err.Error()))
	}
}
