ENV_FILE=.env
ENV_EXAMPLE=.env.example

COMPOSE=docker compose

.PHONY: help setup env infra-up infra-down infra-restart logs \
generate migrate deploy reset-db seed studio \
start dev build lint test clean

help:
	@echo "===== SprintHub Commands ====="
	@echo "make setup         Initial project setup"
	@echo "make env           Create .env"
	@echo "make infra-up      Start infrastructure"
	@echo "make infra-down    Stop infrastructure"
	@echo "make logs          View docker logs"
	@echo "make generate      Prisma generate"
	@echo "make migrate       Prisma migrate"
	@echo "make deploy        Prisma deploy migration"
	@echo "make seed          Seed database"
	@echo "make studio        Prisma Studio"
	@echo "make dev           Start NestJS"
	@echo "make build         Build project"
	@echo "make lint          Run lint"
	@echo "make test          Run tests"
	@echo "make clean         Remove containers & volumes"

setup: env infra-up generate migrate

env:
	@if [ ! -f $(ENV_FILE) ]; then \
		cp $(ENV_EXAMPLE) $(ENV_FILE); \
		echo "✅ .env created"; \
	else \
		echo "⚡ .env already exists"; \
	fi

infra-up: env
	$(COMPOSE) up -d

infra-down:
	$(COMPOSE) down

infra-restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

generate:
	pnpx prisma generate

migrate:
	pnpx prisma migrate dev

deploy:
	pnpx prisma migrate deploy

reset-db:
	pnpx prisma migrate reset

seed:
	pnpx prisma db seed

studio:
	pnpx prisma studio

dev:
	pnpm run start:dev

build:
	pnpm run build

lint:
	pnpm run lint

test:
	pnpm run test

clean:
	$(COMPOSE) down -v --remove-orphans