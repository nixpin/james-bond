package dsp

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

// Service provides DSP control operations via the IDSPClient interface.
type Service struct {
	client IDSPClient
}

// NewService creates a new DSPService.
func NewService(client IDSPClient) *Service {
	return &Service{client: client}
}

// --- Basic Operations ---

func (s *Service) IsConnected() error                 { return s.client.IsConnected() }
func (s *Service) Status() (string, error)            { return s.client.Status() }
func (s *Service) GetAll() (map[string]string, error) { return s.client.GetAll() }
func (s *Service) Get(key string) (string, error)     { return s.client.Get(key) }
func (s *Service) Set(key, value string) error        { return s.client.Set(key, value) }
func (s *Service) ListDevices() ([]string, error)     { return s.client.ListDevices() }
func (s *Service) ListKeys() ([]string, error)        { return s.client.ListKeys() }

// --- SDK: Structured Operations ---

// GetBassBoost returns the current bass boost settings.
func (s *Service) GetBassBoost() (*BassBoost, error) {
	params, err := s.client.GetAll()
	if err != nil {
		return nil, err
	}
	return &BassBoost{
		Enabled: parseBool(params[ParamBassEnable]),
		MaxGain: parseFloat(params[ParamBassMaxGain]),
	}, nil
}

// SetBassBoost updates the bass boost settings.
func (s *Service) SetBassBoost(b *BassBoost) error {
	if err := s.client.Set(ParamBassEnable, fmt.Sprintf("%t", b.Enabled)); err != nil {
		return err
	}
	return s.client.Set(ParamBassMaxGain, fmt.Sprintf("%.1f", b.MaxGain))
}

// GetMaster returns the current master settings.
func (s *Service) GetMaster() (*Master, error) {
	params, err := s.client.GetAll()
	if err != nil {
		return nil, err
	}
	return &Master{
		Enabled:      parseBool(params[ParamMasterEnable]),
		LimRelease:   parseInt(params[ParamMasterLimRel]),
		LimThreshold: parseFloat(params[ParamMasterLimThresh]),
		PostGain:     parseFloat(params[ParamMasterPostGain]),
	}, nil
}

// SetMaster updates the master settings.
func (s *Service) SetMaster(m *Master) error {
	if err := s.client.Set(ParamMasterEnable, fmt.Sprintf("%t", m.Enabled)); err != nil {
		return err
	}
	if err := s.client.Set(ParamMasterLimRel, fmt.Sprintf("%d", m.LimRelease)); err != nil {
		return err
	}
	if err := s.client.Set(ParamMasterLimThresh, fmt.Sprintf("%.1f", m.LimThreshold)); err != nil {
		return err
	}
	return s.client.Set(ParamMasterPostGain, fmt.Sprintf("%.1f", m.PostGain))
}

// GetEqualizer returns the current parametric EQ settings.
func (s *Service) GetEqualizer() (*Equalizer, error) {
	params, err := s.client.GetAll()
	if err != nil {
		return nil, err
	}

	rawEQ := params[ParamToneEQ]
	parts := strings.Split(rawEQ, ";")

	// Filter out empty strings (e.g., from trailing ;) and trim whitespace
	var cleanParts []string
	for _, p := range parts {
		if t := strings.TrimSpace(p); t != "" {
			cleanParts = append(cleanParts, t)
		}
	}

	half := len(cleanParts) / 2
	bands := make([]float64, 0, half)
	gains := make([]float64, 0, half)

	for i := 0; i < half; i++ {
		bands = append(bands, parseFloat(cleanParts[i]))
		
		gain := parseFloat(cleanParts[i+half])
		// Round to 1 decimal place
		roundedGain := math.Round(gain*10) / 10
		gains = append(gains, roundedGain)
	}

	return &Equalizer{
		Enabled:       parseBool(params[ParamToneEnable]),
		Bands:         bands,
		Gains:         gains,
		FilterType:    parseInt(params[ParamToneFilter]),
		Interpolation: parseInt(params[ParamToneInterp]),
	}, nil
}

// SetEqualizer updates the parametric EQ settings.
func (s *Service) SetEqualizer(eq *Equalizer) error {
	if len(eq.Bands) != len(eq.Gains) {
		return fmt.Errorf("bands and gains count mismatch")
	}

	if err := s.client.Set(ParamToneEnable, fmt.Sprintf("%t", eq.Enabled)); err != nil {
		return err
	}
	if err := s.client.Set(ParamToneFilter, fmt.Sprintf("%d", eq.FilterType)); err != nil {
		return err
	}
	if err := s.client.Set(ParamToneInterp, fmt.Sprintf("%d", eq.Interpolation)); err != nil {
		return err
	}

	// Format bands and gains as a single semicolon-separated string
	var parts []string
	for _, b := range eq.Bands {
		parts = append(parts, fmt.Sprintf("%.1f", b))
	}
	for _, g := range eq.Gains {
		parts = append(parts, fmt.Sprintf("%.1f", g))
	}
	return s.client.Set(ParamToneEQ, strings.Join(parts, ";"))
}

// GetTube returns the current tube settings.
func (s *Service) GetTube() (*Tube, error) {
	params, err := s.client.GetAll()
	if err != nil {
		return nil, err
	}
	return &Tube{
		Enabled: parseBool(params[ParamTubeEnable]),
		PreGain: parseFloat(params[ParamTubePreGain]),
	}, nil
}

// SetTube updates the tube settings.
func (s *Service) SetTube(t *Tube) error {
	if err := s.client.Set(ParamTubeEnable, fmt.Sprintf("%t", t.Enabled)); err != nil {
		return err
	}
	return s.client.Set(ParamTubePreGain, fmt.Sprintf("%.1f", t.PreGain))
}

// GetConvolver returns the current convolver settings.
func (s *Service) GetConvolver() (*Convolver, error) {
	params, err := s.client.GetAll()
	if err != nil {
		return nil, err
	}
	return &Convolver{
		Enabled:          parseBool(params[ParamConvolverEnable]),
		File:             params[ParamConvolverFile],
		OptimizationMode: parseInt(params[ParamConvolverOpt]),
		WaveformEdit:     params[ParamConvolverEdit],
	}, nil
}

// SetConvolver updates the convolver settings.
func (s *Service) SetConvolver(c *Convolver) error {
	if err := s.client.Set(ParamConvolverEnable, fmt.Sprintf("%t", c.Enabled)); err != nil {
		return err
	}
	if err := s.client.Set(ParamConvolverFile, c.File); err != nil {
		return err
	}
	if err := s.client.Set(ParamConvolverOpt, fmt.Sprintf("%d", c.OptimizationMode)); err != nil {
		return err
	}
	return s.client.Set(ParamConvolverEdit, c.WaveformEdit)
}

// GetSoundPosition returns the current sound positioning settings.
func (s *Service) GetSoundPosition() (*SoundPosition, error) {
	params, err := s.client.GetAll()
	if err != nil {
		return nil, err
	}
	return &SoundPosition{
		CrossfeedEnabled:  parseBool(params[ParamCrossfeedEnable]),
		CrossfeedMode:     parseInt(params[ParamCrossfeedMode]),
		CrossfeedFeed:     parseInt(params[ParamCrossfeedFeed]),
		CrossfeedFcut:     parseInt(params[ParamCrossfeedFcut]),
		StereowideEnabled: parseBool(params[ParamStereowideEnable]),
		StereowideLevel:   parseInt(params[ParamStereowideLevel]),
	}, nil
}

// SetSoundPosition updates the sound positioning settings.
func (s *Service) SetSoundPosition(sp *SoundPosition) error {
	if err := s.client.Set(ParamCrossfeedEnable, fmt.Sprintf("%t", sp.CrossfeedEnabled)); err != nil {
		return err
	}
	if err := s.client.Set(ParamCrossfeedMode, fmt.Sprintf("%d", sp.CrossfeedMode)); err != nil {
		return err
	}
	if err := s.client.Set(ParamCrossfeedFeed, fmt.Sprintf("%d", sp.CrossfeedFeed)); err != nil {
		return err
	}
	if err := s.client.Set(ParamCrossfeedFcut, fmt.Sprintf("%d", sp.CrossfeedFcut)); err != nil {
		return err
	}
	if err := s.client.Set(ParamStereowideEnable, fmt.Sprintf("%t", sp.StereowideEnabled)); err != nil {
		return err
	}
	return s.client.Set(ParamStereowideLevel, fmt.Sprintf("%d", sp.StereowideLevel))
}

// --- Helpers ---

func parseBool(s string) bool {
	s = strings.ToLower(s)
	return s == "true" || s == "1" || s == "on" || s == "yes"
}

func parseInt(s string) int {
	v, _ := strconv.Atoi(s)
	return v
}

func parseFloat(s string) float64 {
	v, _ := strconv.ParseFloat(s, 64)
	return v
}
