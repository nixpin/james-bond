package dsp

import (
	"github.com/labstack/echo/v4"
)

// Register mounts DSP routes onto the given echo group (all protected by authMW).
func Register(g *echo.Group, authMW echo.MiddlewareFunc, svc *Service) {
	h := NewHandler(svc)

	d := g.Group("/dsp", authMW)
	d.GET("/is-connected", h.IsConnected)
	d.GET("/status", h.GetStatus)
	d.GET("/params", h.GetAll)
	d.GET("/params/:key", h.GetParam)
	d.PUT("/params/:key", h.SetParam)
	d.GET("/devices", h.ListDevices)
	d.GET("/keys", h.ListKeys)

	// SDK: Structured API
	d.GET("/bass", h.GetBass)
	d.PUT("/bass", h.SetBass)
	d.GET("/master", h.GetMaster)
	d.PUT("/master", h.SetMaster)
	d.GET("/equalizer", h.GetEqualizer)
	d.PUT("/equalizer", h.SetEqualizer)
	d.GET("/tube", h.GetTube)
	d.PUT("/tube", h.SetTube)
	d.GET("/convolver", h.GetConvolver)
	d.PUT("/convolver", h.SetConvolver)
	d.GET("/sound-position", h.GetSoundPosition)
	d.PUT("/sound-position", h.SetSoundPosition)
}
