package dsp

import (
	"reflect"
	"testing"
)

func TestServiceEqualizer(t *testing.T) {
	mock := NewMockDSPClient()
	svc := NewService(mock)

	t.Run("GetEqualizer cleans and parses correctly", func(t *testing.T) {
		// Simulations of raw string after it's been processed by CLI parser (quotes removed, but maybe spaces/semicolons remain)
		mock.Params[ParamToneEQ] = " 25.0; 40.0; 63.0; 1.0; 2.0; 3.0; "
		mock.Params[ParamToneEnable] = "true"
		mock.Params[ParamToneFilter] = "1"
		mock.Params[ParamToneInterp] = "0"

		eq, err := svc.GetEqualizer()
		if err != nil {
			t.Fatalf("GetEqualizer failed: %v", err)
		}

		expectedBands := []float64{25, 40, 63}
		expectedGains := []float64{1, 2, 3}

		if !reflect.DeepEqual(eq.Bands, expectedBands) {
			t.Errorf("Bands = %v, want %v", eq.Bands, expectedBands)
		}
		if !reflect.DeepEqual(eq.Gains, expectedGains) {
			t.Errorf("Gains = %v, want %v", eq.Gains, expectedGains)
		}
		if eq.FilterType != 1 {
			t.Errorf("FilterType = %d, want 1", eq.FilterType)
		}
	})

	t.Run("SetEqualizer formats correctly", func(t *testing.T) {
		eq := &Equalizer{
			Enabled:    true,
			Bands:      []float64{25, 40},
			Gains:      []float64{3.14, -2.5},
			FilterType: 2,
		}

		err := svc.SetEqualizer(eq)
		if err != nil {
			t.Fatalf("SetEqualizer failed: %v", err)
		}

		// Verify the raw string sent to the mock client
		expectedRaw := "25.0;40.0;3.1;-2.5" // Note the 3.1 rounding in fmt.Sprintf("%.1f", ...)
		if mock.Params[ParamToneEQ] != expectedRaw {
			t.Errorf("Stored EQ string = %s, want %s", mock.Params[ParamToneEQ], expectedRaw)
		}
	})
}
