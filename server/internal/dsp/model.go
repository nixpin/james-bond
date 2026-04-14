package dsp

// JamesDSP Parameter Keys
const (
	ParamBassEnable       = "bass_enable"
	ParamBassMaxGain      = "bass_maxgain"
	ParamTubeEnable       = "tube_enable"
	ParamTubePreGain      = "tube_pregain"
	ParamMasterEnable     = "master_enable"
	ParamMasterLimRel     = "master_limrelease"
	ParamMasterLimThresh  = "master_limthreshold"
	ParamMasterPostGain   = "master_postgain"
	ParamToneEnable       = "tone_enable"
	ParamToneEQ           = "tone_eq"
	ParamToneFilter       = "tone_filtertype"
	ParamToneInterp       = "tone_interpolation"
	ParamConvolverEnable  = "convolver_enable"
	ParamConvolverFile    = "convolver_file"
	ParamConvolverOpt     = "convolver_optimization_mode"
	ParamConvolverEdit    = "convolver_waveform_edit"
	ParamCrossfeedEnable  = "crossfeed_enable"
	ParamCrossfeedMode    = "crossfeed_mode"
	ParamCrossfeedFeed    = "crossfeed_bs2b_feed"
	ParamCrossfeedFcut    = "crossfeed_bs2b_fcut"
	ParamStereowideEnable = "stereowide_enable"
	ParamStereowideLevel  = "stereowide_level"
)

// BassBoost represents dynamic bass boost settings.
type BassBoost struct {
	Enabled bool    `json:"enabled"`
	MaxGain float64 `json:"max_gain"` // [3 - 15] dB
}

// Tube represents analog modelling settings.
type Tube struct {
	Enabled bool    `json:"enabled"`
	PreGain float64 `json:"pre_gain"` // [-300 - 1200] dB (x100)
}

// Master represents limiter and master gain settings.
type Master struct {
	Enabled      bool    `json:"enabled"`
	LimRelease   int     `json:"limiter_release"`   // [2 - 500] ms
	LimThreshold float64 `json:"limiter_threshold"` // [-60 - 0] dB
	PostGain     float64 `json:"post_gain"`         // [-15 - 15] dB
}

// Equalizer represents parametric EQ settings.
type Equalizer struct {
	Enabled       bool      `json:"enabled"`
	Bands         []float64 `json:"bands"`         // Frequency values
	Gains         []float64 `json:"gains"`         // Gain values
	FilterType    int       `json:"filter_type"`   // [0 - 5]
	Interpolation int       `json:"interpolation"` // [0 - 1]
}

// Convolver represents impulse response convolution settings.
type Convolver struct {
	Enabled          bool   `json:"enabled"`
	File             string `json:"file"`
	OptimizationMode int    `json:"optimization_mode"` // [0 - 2]
	WaveformEdit     string `json:"waveform_edit"`     // Advanced editing string
}

// SoundPosition represents crossfeed and stereowide settings.
type SoundPosition struct {
	CrossfeedEnabled  bool `json:"crossfeed_enabled"`
	CrossfeedMode     int  `json:"crossfeed_mode"` // [0 - 5, 99]
	CrossfeedFeed     int  `json:"crossfeed_feed"` // [10 - 150] (x10)
	CrossfeedFcut     int  `json:"crossfeed_fcut"` // [300 - 2000] Hz
	StereowideEnabled bool `json:"stereowide_enabled"`
	StereowideLevel   int  `json:"stereowide_level"` // [30 - 75]
}

// IDSPClient is the interface for communicating with the JamesDSP CLI.
type IDSPClient interface {
	IsConnected() error
	Status() (string, error)
	GetAll() (map[string]string, error)
	Get(key string) (string, error)
	Set(key, value string) error
	ListDevices() ([]string, error)
	ListKeys() ([]string, error)
}
