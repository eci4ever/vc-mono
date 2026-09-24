.PHONY: help web build run dev-web migrate test tidy deploy clean

APP_DIR    := apps/api
WEB_DIR    := apps/web
EMBED_DIST := apps/api/webfs/dist
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-10s %s\n", $$1, $$2}'

web: ## Build the React app straight into the Go embed directory
	npm -w apps/web run build
	touch $(EMBED_DIST)/.gitkeep

build: web ## Build the API binary with the web app embedded
	go build -o server .

run: ## Run the API locally (serves API + built SPA on :3000)
	go run .

dev-web: ## Run the Vite dev server (proxies /api to :3000)
	npm -w apps/web run dev

migrate: ## Apply database migrations
	cd $(APP_DIR) && go run ./cmd/migrate

test: ## Run Go tests
	cd $(APP_DIR) && go test ./...

tidy: ## Tidy Go modules and regenerate sqlc code
	cd $(APP_DIR) && go mod tidy
	go mod tidy
	sqlc generate

deploy: ## Deploy to Vercel (production)
	npx vercel --prod --yes

clean: ## Remove build artifacts
	rm -rf server $(EMBED_DIST) $(WEB_DIR)/dist
