#!/usr/bin/env make

.PHONY: docker-console console start setup docker-build

export NODE_ENV=development

# ---------------------------------------------------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------------------------------------------------
DOCKER_IMAGE_VERSION=dev-enviroment
DOCKER_IMAGE_TAG=serverless-aws-node:$(DOCKER_IMAGE_VERSION)

# ---------------------------------------------------------------------------------------------------------------------
# DOCKER
# ---------------------------------------------------------------------------------------------------------------------

docker-build:
	@docker build -t $(DOCKER_IMAGE_TAG) .

docker-console:
	docker-compose run --rm --publish=8080:8080 dev-enviroment /bin/sh

console: docker-console