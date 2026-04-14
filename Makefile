.PHONY: help build run clean test dev

# Load environment variables from .env file if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'


# Build both backend and frontend
build: build-client build-server ## Build both frontend and backend (with embedding)

build-server: ## Build only the Go backend (requires frontend assets in internal/web/dist)
	@echo "Building server..."
	mkdir -p server/internal/web/dist
	# Ensure index.html exists for embedding even if client build is skipped
	touch server/internal/web/dist/index.html
	cd server && go build -o ../bin/server main.go

build-client: ## Build only the Lit frontend
	@echo "Building web client..."
	cd web-client && npm run build
	@echo "Syncing assets for embedding..."
	rm -rf server/internal/web/dist/*
	cp -r web-client/dist/* server/internal/web/dist/

# Docker operations
docker-build: ## Build the full Docker image
	@echo "Building Docker image..."
	docker build -f deploy/docker/Dockerfile -t james-bond:latest .

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
	# cd web-client && npm test # (Not implemented yet)

# Cleanup
clean: ## Remove build artifacts and stop containers
	@echo "Cleaning up..."
	rm -rf bin/
	rm -rf web-client/dist/
	rm -rf server/internal/web/dist/*
	cd deploy && docker compose down
