package dsp

import (
	"reflect"
	"testing"
)

func TestParseKeyValues(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected map[string]string
	}{
		{
			name:  "Standard key value pairs",
			input: "master_enable=true\ntube_pregain=3.5",
			expected: map[string]string{
				"master_enable": "true",
				"tube_pregain":  "3.5",
			},
		},
		{
			name:  "Handling quotes and whitespace",
			input: " tone_eq = \"25.0;40.0;0\" \n master_gain = -12.0 ",
			expected: map[string]string{
				"tone_eq":     "25.0;40.0;0",
				"master_gain": "-12.0",
			},
		},
		{
			name:  "Real-world 15-band EQ output (quoted)",
			input: "tone_eq=\"25.0;40.0;63.0;100.0;160.0;250.0;400.0;630.0;1000.0;1600.0;2500.0;4000.0;6300.0;10000.0;16000.0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0\"",
			expected: map[string]string{
				"tone_eq": "25.0;40.0;63.0;100.0;160.0;250.0;400.0;630.0;1000.0;1600.0;2500.0;4000.0;6300.0;10000.0;16000.0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0",
			},
		},
		{
			name:  "Empty lines and garbage input line",
			input: "\nkey1=val1\n\ninvalid_line_without_equal\nkey2=val2\n",
			expected: map[string]string{
				"key1": "val1",
				"key2": "val2",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := parseKeyValues(tt.input)
			if !reflect.DeepEqual(got, tt.expected) {
				t.Errorf("parseKeyValues() = %v, want %v", got, tt.expected)
			}
		})
	}
}
