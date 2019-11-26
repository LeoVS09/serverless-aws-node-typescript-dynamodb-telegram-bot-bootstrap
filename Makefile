#!/usr/bin/env make

.PHONY: docker-console console start setup docker-build deploy deploy-fn logs invoke login local read-local-enviroment encript-dev decript-dev encript-prod decript-prod create test create-test test-fn

export NODE_ENV=development

# ---------------------------------------------------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------------------------------------------------

DOCKER_IMAGE_VERSION=dev-enviroment
DOCKER_IMAGE_TAG=serverless-aws-node:$(DOCKER_IMAGE_VERSION)

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
	sls deploy function -f hello

# View logs of hello function and tail via -t flag
logs:
	serverless logs -f hello -t

# Will create function with name `functionName` in `./api/index.js` file and 
# a Javascript function `module.exports.handler` as the entrypoint for the Lambda function
# and add test for them to `test/functionName.js` file
create-function-example: 
	sls create function -f functionName  --handler api/index.handler

create:
	sls create function -f ${FN} --handler ${HANDL}

# ----------------------------------------------------- INVOKE ---------------------------------------------------------

# Invoke the Lambda directly and print log statements via
invoke:
	serverless invoke --function=hello --log

# Invoke functioon localy
# Unforrtunately  we cannot push  all enviroment variables to function only by key=value pairs after '-e' paramet
local:
	serverless invoke local --function=hello --log

# Unforrtunately  we cannot push  all enviroment variables to function only by key=value pairs after '-e' paramet
local-env:
	. ./dev.env && serverless invoke local --function=hello --log -e SECRET_FUNCTION_TOKEN="$$SECRET_FUNCTION_TOKEN"

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

# --------------------------------------------------- TESTS --------------------------------------------------------------- 

# Add test to existing handler
create-test:
	sls create tetst -f ${FN}

# Tests can be run directly using Jest or using the "invoke test" command
test: 
	sls invoke test

# Run test of function directly
test-fn:
	sls invoke test -f ${FN}