package auth

import "github.com/golang-jwt/jwt/v5"

// Role defines the authorization level of a user.
type Role string

const (
	RoleAdmin  Role = "admin"
	RoleClient Role = "client"
)

// Claims is the JWT payload.
type Claims struct {
	Username string `json:"username"`
	Role     Role   `json:"role"`
	jwt.RegisteredClaims
}

// Client represents a registered API client stored on disk.
type Client struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Token    string `json:"token"` // pre-shared token from env
}
