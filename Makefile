#!/usr/bin/env make

.PHONY: docker-console console start setup docker-build deploy deploy-fn logs invoke login local read-local-enviroment encript-dev decript-dev encript-prod decript-prod create test create-test test-fn

export NODE_ENV=development

# Macros to get arguments passed to make command
args = $(filter-out $@,$(MAKECMDGOALS))

# ---------------------------------------------------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------------------------------------------------

DOCKER_IMAGE_VERSION=dev-enviroment
DOCKER_IMAGE_TAG=serverless-aws-node-typescript-dynamodb-telegram-bot-bootstrap:$(DOCKER_IMAGE_VERSION)

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
	docker-compose run --rm --publish=3000:3000 dev-enviroment /bin/bash

console: docker-console

# ---------------------------------------------------------------------------------------------------------------------
# SERVERLESS
# ---------------------------------------------------------------------------------------------------------------------

# Redeploy entire stack throught cloud function
# Example: make deploy
# Example with stage: make deploy --stage prod
deploy: 
	serverless deploy $(call args)

login: 
	serverless login

# Redeploy only the code + dependencies to update the AWS lambda function
# Faster then full deploy
# example: deploy-fn hello
deploy-fn:
	sls deploy function -f $(call args)

# View logs of hello function and tail via -t flag
# example: make logs hello
logs:
	serverless logs -t -f $(call args)

# Will create function with name `functionName` in `./api/index.js` file and 
# a Javascript function `module.exports.handler` as the entrypoint for the Lambda function
# and add test for them to `test/functionName.js` file
create-function-example: 
	sls create function -f functionName  --handler api/index.handler

create:
	sls create test -f ${FN} --handler ${HANDL}

# ----------------------------------------------------- INVOKE ---------------------------------------------------------

# Invoke the Lambda directly and print log statements via
# Example: make invoke hello
invoke:
	serverless invoke --log --function=$(call args) 

# Invoke functioon localy
# Example: make local hello
local:
	serverless invoke local --log --function=$(call args)

# Unforrtunately we cannot push all enviroment variables to function only by key=value pairs after '-e' paramet
# Example: make local-env hello
local-env:
	. ./dev.env && serverless invoke local --log -e SECRET_FUNCTION_TOKEN="$$SECRET_FUNCTION_TOKEN" --function=$(call args)

# --------------------------------------------------- ENCRIPTION ---------------------------------------------------------

# run command like that `make encript-dev 123`

# Encript dev stage secret file with given password
encript-dev:
	serverless encrypt --stage dev --password $(call args)

# Decript prod stage secrets file with given password
decript-dev:
	serverless decrypt --stage dev --password $(call args)

# Encript prod stage secret file with given password
encript-prod:
	serverless encrypt --stage prod --password $(call args)

# Decript prod stage secrets file with given password
decript-prod:
	serverless decrypt --stage prod --password $(call args)

# --------------------------------------------------- TESTS --------------------------------------------------------------- 

# Add test to existing handler
# Example: make create-test hello
create-test:
	sls create test -f $(call args)

# Tests can be run directly using mocha or using the "invoke test" command
test: 
	sls webpack -o testBuild
	sls invoke test --root testBuild/service
	rm -rf testBuild

# Run test of function directly
# Example: make test-fn hello
test-fn:
	sls invoke test -f $(call args)

# -------------------------------------------------- OFFLINE -------------------------------------------------------------- 

# Will start service offline so you can curl you lambdas (default port: 3000)
offline:
	sls offline start

# start command will fire an init and a end lifecycle hook which is needed for serverless-offline and serverless-dynamodb-local to switch off both ressources
# if you not want it you can run
offline-without-db:
	sls offline

# ------------------------------------------------ DYNAMO-DB --------------------------------------------------------------

# Install AWS DynamoDB locally for invoke function which require DynamoDB
dynamodb-install:
	sls dynamodb install

# Uninstall AWS DynamoDB 
dynamodb-remove:
	sls dynamodb remove

# Start AWS DynamoDB
dynamodb-start:
	sls dynamodb start $(call args)

# Inject data into DynamoDB
dynamodb-seed:
	sls dynamodb seed --seed=$(call args)

# ------------------------------------------------ API EXAMPLE --------------------------------------------------------------

# Will create new todo in offline start service and return all
todo-create:
	curl -X POST -H "Content-Type:application/json" http://localhost:3000/todos --data '{ "text": "Learn Serverless" }'

todo-list:
	curl -X GET -H "Content-Type:application/json" http://localhost:3000/todos

todo-get:
	curl -X GET -H "Content-Type:application/json" http://localhost:3000/todos/$(call args)

todo-update:
	curl -X PUT -H "Content-Type:application/json" http://localhost:3000/todos/$(call args) --data '{ "text": "changed todo", "checked": true }'

todo-delete:
	curl -X DELETE -H "Content-Type:application/json" http://localhost:3000/todos/$(call args)

# ---------------------------------------------------------------------------------------------------------------------
# TELEGRAM
# ---------------------------------------------------------------------------------------------------------------------

make webhook:
	curl --request POST --url https://api.telegram.org/bot${TOKEN}/setWebhook --header 'content-type: application/json' --data '{"url": "$(call args)"}'