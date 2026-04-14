package config

import (
	"os"
	"strings"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	Port         string
	DataDir      string
	JWTSecret    string
	JamesDSPBin  string
	AdminUser    string
	AdminPass    string
	ClientTokens []string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *Config {
	return &Config{
		Port:         getEnv("JB_SERVER_PORT", ":8080"),
		DataDir:      getEnv("JB_DATA_DIR", "./data"),
		JWTSecret:    getEnv("JB_JWT_SECRET", ""),
		JamesDSPBin:  getEnv("JB_JAMESDSP_BIN", "jamesdsp"),
		AdminUser:    getEnv("JB_ADMIN_USER", ""),
		AdminPass:    getEnv("JB_ADMIN_PASS", ""),
		ClientTokens: parseList(getEnv("JB_CLIENT_TOKENS", "")),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func parseList(s string) []string {
	if s == "" {
		return nil
	}
	return strings.Split(s, ",")
}
