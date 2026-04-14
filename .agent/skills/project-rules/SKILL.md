---
name: project-rules
description: Follow the project rules for all tasks.
---

# General Rules
- all comments, texts, and documentation must be in English
- all texts must be as const string in the code

# Frontend Rules
- all frontend code must be in TypeScript
- all frontend code must use lit
- all frontend code must use tailwindcss
- all frontend code must use vite
- all frontend code must be offline first (fonts, images, css, js, etc must be local)
- all frontend code must use pwa
- all frontend code must use web components
- all elements(label, inputs, dropdowns, buttons, etc) must be reusable and defined in their own file
- all styles must be define in css (not in html!!!)

# Backend Rules
- all backend code must be in Go
- all backend code must use echo
- all backend code must use slog
- all backend code must use modular architecture
- all backend code must use clean architecture
- all code must be testable
- use ./server/docs/jamesdsp-headless.md for reference for jamesdsp-headless commands and parameters

# Backend Architecture

## Structure
- Module-first: each domain is a self-contained folder under `server/internal/`
- `internal/` is kept for Go compiler protection
- Modules: `auth`, `dsp`, `presets`, `impulses`
- Each module contains: model.go, service.go, storage.go or cli.go, handler.go, routes.go

## Module File Responsibilities
- `model.go`   — domain structs + local interface definitions
- `service.go` — business logic, injected with interfaces
- `storage.go` — file-based repository implementation
- `cli.go`     — CLI adapter (for dsp module only)
- `handler.go` — Echo handlers + request/response DTOs (inline)
- `routes.go`  — Register(group, ...) function for route registration

## Configuration
- all config loaded from environment variables via `config/config.go`
- required env vars: JWT_SECRET, ADMIN_USER, ADMIN_PASS
- optional env vars: SERVER_PORT (default :8080), DATA_DIR (default ./data), JAMESDSP_BIN (default jamesdsp), CLIENT_TOKENS (comma-separated)

## Authentication
- full JWT authentication
- users (admin + clients) are defined via environment variables
- admin: ADMIN_USER + ADMIN_PASS env vars
- clients: CLIENT_TOKENS env var (comma-separated pre-issued tokens)
- JWT tokens signed with JWT_SECRET
- auth.Middleware() is created once in main.go and passed as argument to each module's Register() function
- protected routes use Authorization: Bearer <jwt> header

## Storage
- all runtime data stored in `./data/` directory (configured via DATA_DIR env)
- data/clients.json  — client token records
- data/presets/      — preset JSON files
- data/impulses/     — uploaded IR (.wav) files

## Inter-Module Dependencies
- modules do NOT import each other directly
- each module defines its own minimal local interface for what it needs from another module
- main.go is the only place that imports all modules and wires concrete implementations
- Go's implicit interface satisfaction handles the connection
- example: presets/model.go defines `type DSPLoader interface { Set(key, value string) error }`
  and main.go passes *dsp.Service which satisfies it

## main.go Pattern (Composition Root)
- main.go only wires: config → adapters → services → middleware → routes
- no business logic in main.go
- order: Load config → create adapters → create services → create middleware → register routes → start server

## Route Conventions
- all API routes are prefixed with /api
- health check at /health (no auth)
- admin-only routes protected by role check inside handler or via separate admin middleware group
