package dsp

import "fmt"

// MockDSPClient implements IDSPClient for testing purposes.
type MockDSPClient struct {
	Connected bool
	Params    map[string]string
	LastSetKey   string
	LastSetValue string
}

func NewMockDSPClient() *MockDSPClient {
	return &MockDSPClient{
		Connected: true,
		Params:    make(map[string]string),
	}
}

func (m *MockDSPClient) IsConnected() error {
	if !m.Connected {
		return fmt.Errorf("mock disconnected")
	}
	return nil
}

func (m *MockDSPClient) Status() (string, error) {
	return "mock status", nil
}

func (m *MockDSPClient) GetAll() (map[string]string, error) {
	return m.Params, nil
}

func (m *MockDSPClient) Get(key string) (string, error) {
	return m.Params[key], nil
}

func (m *MockDSPClient) Set(key, value string) error {
	m.LastSetKey = key
	m.LastSetValue = value
	m.Params[key] = value
	return nil
}

func (m *MockDSPClient) ListDevices() ([]string, error) {
	return []string{"Mock Device"}, nil
}

func (m *MockDSPClient) ListKeys() ([]string, error) {
	keys := make([]string, 0, len(m.Params))
	for k := range m.Params {
		keys = append(keys, k)
	}
	return keys, nil
}
