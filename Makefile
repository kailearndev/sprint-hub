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
	npx prisma generate

migrate:
	npx prisma migrate dev

deploy:
	npx prisma migrate deploy

reset-db:
	npx prisma migrate reset

seed:
	npx prisma db seed

studio:
	npx prisma studio

dev:
	npm run start:dev

build:
	npm run build

lint:
	npm run lint

test:
	npm run test

clean:
	$(COMPOSE) down -v --remove-orphans