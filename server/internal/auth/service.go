package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/james-bond/dsp-control-server/config"
)

const (
	tokenExpiry         = 24 * time.Hour
	errInvalidCreds     = "invalid username or password"
	errTokenGeneration  = "failed to generate token"
)

// Service handles authentication business logic.
type Service struct {
	cfg *config.Config
}

// NewService creates a new AuthService.
func NewService(cfg *config.Config) *Service {
	return &Service{cfg: cfg}
}

// Login validates credentials and returns a signed JWT token.
// Accepts admin credentials from config or pre-shared client tokens.
func (s *Service) Login(username, password string) (string, Role, error) {
	role, ok := s.validateCredentials(username, password)
	if !ok {
		return "", "", errors.New(errInvalidCreds)
	}

	token, err := s.issueToken(username, role)
	if err != nil {
		return "", "", errors.New(errTokenGeneration)
	}

	return token, role, nil
}

// ValidateClaims parses and validates a JWT token string, returning its claims.
func (s *Service) ValidateClaims(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.cfg.JWTSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid or expired token")
	}
	return claims, nil
}

func (s *Service) validateCredentials(username, password string) (Role, bool) {
	// Check admin credentials
	if username == s.cfg.AdminUser && password == s.cfg.AdminPass {
		return RoleAdmin, true
	}
	// Check client tokens (username=token, password=token)
	for _, t := range s.cfg.ClientTokens {
		if password == t {
			return RoleClient, true
		}
	}
	return "", false
}

func (s *Service) issueToken(username string, role Role) (string, error) {
	claims := &Claims{
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenExpiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.cfg.JWTSecret))
}
