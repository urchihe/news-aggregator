
# .ALLPREFIX = "   "
# Include .env.test if it exists
ifneq (, $(wildcard ./.env.test))
	include .env.test
	export
endif

# Include .env if it exists
ifneq (, $(wildcard ./.env))
	include .env
	export
endif

# Include .env.prod if it exists
ifneq (, $(wildcard ./.env.prod))
	include .env.prod
	export
endif
# Target to create .env file from .env.example
create-env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo ".env file created from .env.example"; \
	else \
		echo ".env file already exists. Skipping."; \
	fi

#connect to php container
.PHONY: backend-php
backend-php: ;\
	docker compose exec backend-php bash

#Launch migration
.PHONY: migrate
migrate: ;\
	docker compose exec backend-php composer --run console doctrine:migrate:migrate -n

#up docker composer
up: create-env ;\
	DOCKER_BUILDKIT=1 docker compose up -d

#down docker composer
down: ;\
	docker compose down

# stronger down (remove volume / image / orphans)
.PHONY: fdown
fdown: ;\
   docker compose down -v --remove-orphans

# stronger up (recreate all container and rebuild the image)
fup: ;\
    DOCKER_BUILDKIT=1 docker compose up -d --force-recreate --build


# Soft Restart
.PHONY: restart
restart: down up

# Hard restart
.PHONY: frestart
frestart: fdown fup


.PHONY: dumpautoload
dumpautoload: ;\
	docker compose exec backend-php composer -- dumpautoload

#
# Theses are static analyses + tests
#
.PHONY: phpmd
phpmd: ;\
	docker compose exec backend-php composer -- run phpmd

.PHONY: cs-fix
cs-fix: ;\
	docker compose exec backend-php composer -- run cs-fix


.PHONY: cs-check
cs-check: ;\
	docker compose exec backend-php composer -- run cs-check

.PHONY: phpstan
phpstan: ;\
	docker compose exec backend-php composer -- run phpstan

# Run all CI tools
.PHONY: ci
ci: cs-fix phpstan phpmd

.PHONY: test-app
test-user: ;\
	docker compose exec backend-php composer run test

