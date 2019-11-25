#!/usr/bin/env make

.PHONY: docker-console console start setup docker-build deploy deploy-fn logs invoke login local read-local-enviroment encript-dev decript-dev encript-prod decript-prod

export NODE_ENV=development

# ---------------------------------------------------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------------------------------------------------

DOCKER_IMAGE_VERSION=dev-enviroment
DOCKER_IMAGE_TAG=serverless-aws-node-dynamodb:$(DOCKER_IMAGE_VERSION)

# ---------------------------------------------------------------------------------------------------------------------
# SETUP
# ---------------------------------------------------------------------------------------------------------------------

setup:
	./bin/setup.sh

read-local-enviroment:
	. ./dev.env && echo "$$SECRET_FUNCTION_TOKEN"

# ---------------------------------------------------------------------------------------------------------------------
# DOCKER
# ---------------------------------------------------------------------------------------------------------------------

docker-build:
	@docker build -t $(DOCKER_IMAGE_TAG) .

docker-console:
	docker-compose run --rm --publish=8080:8080 dev-enviroment /bin/bash

console: docker-console

# ---------------------------------------------------------------------------------------------------------------------
# SERVERLESS
# ---------------------------------------------------------------------------------------------------------------------

# Redeploy entire stack throught cloud function
deploy: 
	serverless deploy

login: 
	serverless login

# Redeploy only the code + dependencies to update the AWS lambda function
# Faster then full deploy
deploy-fn:
	sls deploy function -f create

# View logs of create function and tail via -t flag
logs:
	serverless logs -f create -t

# ----------------------------------------------------- INVOKE ---------------------------------------------------------

# Invoke the Lambda directly and print log statements via
invoke:
	serverless invoke --function=create --log

# Invoke functioon localy
# Unforrtunately  we cannot push  all enviroment variables to function only by key=value pairs after '-e' paramet
local:
	serverless invoke local --function=create --log

# Unforrtunately  we cannot push  all enviroment variables to function only by key=value pairs after '-e' paramet
local-env:
	. ./dev.env && serverless invoke local --function=create --log -e SECRET_FUNCTION_TOKEN="$$SECRET_FUNCTION_TOKEN"

# --------------------------------------------------- ENCRIPTION ---------------------------------------------------------

# run command like that `make PASSWORD=123 encript-dev`

# Encript dev stage secret file with given password
encript-dev:
	serverless encrypt --stage dev --password ${PASSWORD}

# Decript prod stage secrets file with given password
decript-dev:
	serverless decrypt --stage dev --password ${PASSWORD}

# Encript prod stage secret file with given password
encript-prod:
	serverless encrypt --stage prod --password ${PASSWORD}

# Decript prod stage secrets file with given password
decript-prod:
	serverless decrypt --stage prod --password ${PASSWORD}
