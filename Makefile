.PHONY: help build run clean test dev

# help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'


# Build both backend and frontend
build: build-server build-client ## Build both backend and frontend

build-server: ## Build only the Go backend
	@echo "Building server..."
	cd server && go build -o ../bin/server main.go

build-client: ## Build only the Lit frontend
	@echo "Building web client..."
	cd web-client && npm run build

# Run the entire stack using Docker Compose
run: ## Start the management suite using Docker Compose
	@echo "Starting the management suite..."
	cd deploy && docker compose up -d

# Development mode for both
dev: ## Run both backend and frontend in development mode
	@echo "Starting development mode..."
	# Run backend in background and frontend in foreground
	cd server && go run main.go &
	cd web-client && npm run dev

# Testing
test: ## Run unit tests for backend and frontend
	@echo "Running tests..."
	cd server && go test ./...
	cd web-client && npm test

# Cleanup
clean: ## Remove build artifacts and stop containers
	@echo "Cleaning up..."
	rm -rf bin/
	rm -rf web-client/dist/
	cd deploy && docker compose down
