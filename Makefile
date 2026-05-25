ENV_FILE=.env
ENV_EXAMPLE=.env.example

COMPOSE=docker compose

.PHONY: help env infra-up infra-down infra-restart logs migrate generate reset-db clean

help:
	@echo "Available commands:"
	@echo "  make env           Create .env from .env.example"
	@echo "  make infra-up      Start postgres & redis"
	@echo "  make infra-down    Stop containers"
	@echo "  make infra-restart Restart containers"
	@echo "  make migrate       Run prisma migrations"
	@echo "  make generate      Generate prisma client"
	@echo "  make reset-db      Reset database"
	@echo "  make logs          View logs"
	@echo "  make clean         Remove containers and volumes"

env:
	@if [ ! -f $(ENV_FILE) ]; then \
		cp $(ENV_EXAMPLE) $(ENV_FILE); \
		echo "✅ .env created"; \
	else \
		echo "⚡ .env already exists"; \
	fi

infra-up: env
	$(COMPOSE) up -d postgres redis

infra-down:
	$(COMPOSE) down

infra-restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

generate:
	npx prisma generate

migrate:
	npx prisma migrate dev

reset-db:
	npx prisma migrate reset

clean:
	$(COMPOSE) down -v