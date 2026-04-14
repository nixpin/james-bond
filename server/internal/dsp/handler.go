package dsp

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// SetParamRequest is the body for PUT /api/dsp/params/:key.
type SetParamRequest struct {
	Value string `json:"value" validate:"required"`
}

// Handler holds DSP HTTP handlers.
type Handler struct {
	svc *Service
}

// NewHandler creates a new DSP Handler.
func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

// IsConnected handles GET /api/dsp/is-connected.
func (h *Handler) IsConnected(c echo.Context) error {
	if err := h.svc.IsConnected(); err != nil {
		return c.JSON(http.StatusServiceUnavailable, map[string]string{"status": "disconnected"})
	}
	return c.JSON(http.StatusOK, map[string]string{"status": "connected"})
}

// GetStatus handles GET /api/dsp/status.
func (h *Handler) GetStatus(c echo.Context) error {
	status, err := h.svc.Status()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, map[string]string{"status": status})
}

// GetAll handles GET /api/dsp/params.
func (h *Handler) GetAll(c echo.Context) error {
	params, err := h.svc.GetAll()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, params)
}

// GetParam handles GET /api/dsp/params/:key.
func (h *Handler) GetParam(c echo.Context) error {
	key := c.Param("key")
	value, err := h.svc.Get(key)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, map[string]string{"key": key, "value": value})
}

// SetParam handles PUT /api/dsp/params/:key.
func (h *Handler) SetParam(c echo.Context) error {
	key := c.Param("key")
	var req SetParamRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if err := h.svc.Set(key, req.Value); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, map[string]string{"key": key, "value": req.Value})
}

// ListDevices handles GET /api/dsp/devices.
func (h *Handler) ListDevices(c echo.Context) error {
	devices, err := h.svc.ListDevices()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, map[string]any{"devices": devices})
}

// ListKeys handles GET /api/dsp/keys.
func (h *Handler) ListKeys(c echo.Context) error {
	keys, err := h.svc.ListKeys()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, map[string]any{"keys": keys})
}

// --- SDK: Structured Handlers ---

func (h *Handler) GetBass(c echo.Context) error {
	data, err := h.svc.GetBassBoost()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, data)
}

func (h *Handler) SetBass(c echo.Context) error {
	var req BassBoost
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if err := h.svc.SetBassBoost(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, req)
}

func (h *Handler) GetMaster(c echo.Context) error {
	data, err := h.svc.GetMaster()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, data)
}

func (h *Handler) SetMaster(c echo.Context) error {
	var req Master
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if err := h.svc.SetMaster(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, req)
}

func (h *Handler) GetEqualizer(c echo.Context) error {
	data, err := h.svc.GetEqualizer()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, data)
}

func (h *Handler) SetEqualizer(c echo.Context) error {
	var req Equalizer
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if err := h.svc.SetEqualizer(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, req)
}

func (h *Handler) GetTube(c echo.Context) error {
	data, err := h.svc.GetTube()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, data)
}

func (h *Handler) SetTube(c echo.Context) error {
	var req Tube
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if err := h.svc.SetTube(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, req)
}

func (h *Handler) GetConvolver(c echo.Context) error {
	data, err := h.svc.GetConvolver()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, data)
}

func (h *Handler) SetConvolver(c echo.Context) error {
	var req Convolver
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if err := h.svc.SetConvolver(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, req)
}

func (h *Handler) GetSoundPosition(c echo.Context) error {
	data, err := h.svc.GetSoundPosition()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, data)
}

func (h *Handler) SetSoundPosition(c echo.Context) error {
	var req SoundPosition
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}
	if err := h.svc.SetSoundPosition(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, req)
}
