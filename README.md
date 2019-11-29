# Serverless AWS Node DynamoDB Bootstrap
Base setup of enviroment and tools to start develop on lambda functions from zero (minimal) configuration

Contains:
* node enviroment setup 
* typescript setup 
* webpack serverless setup - to compile typescript and pack for deploy node_modules 
* Enviroment variables - setup for work with enviroment variables, you can setup their local and in produciton
* Encripted file variables - setup for store variables in encripted file 
* Tests - you can develop you function by run test of functions locally
* DynamoDB - setup for star work with dynamodb
* Offline - allow you start you server local and develop without deploys (you can curl your functions)
* DynamoDB Local - setup for local instance of DynamoDB will allow you develop on local machine with database

## Servless from scratch tutorial

This tutorial use `make` util (it available for linux and windows) to create one file which commands you can use, 
but if you prefer type commands by self or not want to use `make`
you can read all command in `Makefile`. Format of file trying to be self decriptive and easy to understand for new commers.

### Fast setup 
Just go step by step and you will deploy you function to AWS

```bash
git clone https://github.com/LeoVS09/serverless-aws-node-bootstrap.git
cd ./serverless-aws-node-bootstrap

# Genereta enviroment template
make setup
# Write you secrets to '.env' file

# Then start docker container with installed dependencies
make console

# Write you project name, app, org into serverless.yml
# app and org you can find into you dashboard.serverless.com

# Then deploy you function to AWS
make deploy
# will run serverless deploy
```

### Setup local enviroment
This command will generate configuration enviroment `.env` file which will be used by docker and serveless

```bash
make setup
```

### In docker isolated linux development
This bootstrap allow (but not require) develop all code inside docker container

This will achive you prevent problems:
* If you develop on windows, but want use linux enviromnt in production, you can develop in linux container
* If you not want install all required tool and packages in global enviroment you machine you can use predefinet container
* If multiple new team members will work on you package you not need to explain what need to install on their machines

Start docker container, sync all local files, get console inside
```bash
make console
```

Rebuild local docker image
```bash
make docker-build
```

### Deploy you serverless functions
Commands to deploy you function

>Note login to serverless when deploy first time
Deploy to aws cloud by serverless 
```bash
make deploy
# serverless deploy
```

Login to serverless
```bash
make login
# serverless login
```

### Create new function
You can create new function by `sls create` command

This command will generate for you new handler file, add new function to `serverless.yml` config and add intial test

You can use predefined `make` command for it
```bash
make FN=newFunction HANDL=api/functionc/index create 
# sls create function -f newFunction --handler api/functionc/index
```

### Serverless tips

You can deploy faster by update only codee and dependencies of individual function
Example for `hello` function
```bash
make deploy-fn hello
# sls deploy function -f hello
```

Get logs of deployed `hello` function
```bash
make logs hello
# serverless logs -t -f hello
```

Invoke function in cloud and print their log
```bash
make invoke hello
# serverless invoke --log --function=hello
```

Invoke function locally and print logs
```bash
make local hello
# serverless invoke local --log --function=hello
```

### Enviroment variables
You can setup you enviroment variables by set them in serverless.yml file
```yml
    enviroment:
      SECRET_FUNCTION_TOKEN: ${env:SECRET_FUNCTION_TOKEN}
      STAGE: ${self:provider.stage}
```
where ${env:<NAME>} local enviroment variables which must be passed
*you can define them in AWS cloud* [aws docs](https://docs.aws.amazon.com/en_us/lambda/latest/dg/env_variables.html)

For local development we must paste them in KEY:VALUES pairs
```bash
serverless invoke local --function=hello --log -e SECRET_FUNCTION_TOKEN=VALUE OTHER_ENVIROMENT_VARIBLE=ANOTHER_VALUE
```

For setup it from file we maked `dev.env` file which will be readed by make command `read-local-enviroment`

So you can just run it by
```bash
make local-env hello
# . ./dev.env && serverless invoke local --log -e SECRET_FUNCTION_TOKEN="$$SECRET_FUNCTION_TOKEN" --function=hello
```

### Encription
If you want to store you project in open source, you might be able to store secret tokens and keys.
You store them in file `secrets.dev.yml` (for developement as example) and encrit to save it in version control (git)

`make setup` command was create for you example file `secrets.dev.yml`.
```yml
SECRET_SERVICE_KEY: SOME_SECRET_KEY
```

This file will be used to ush secret variables to enviroment variables of you function
```yml
custom:
  secrets: ${file(secrets.${opt:stage, self:provider.stage}.yml)}
# ...
enviroment:
    SECRET_SERVICE_KEY: ${self:custom.secrets.SECRET_SERVICE_KEY}
```

And when you will run `serverless deploy` it will push variables from file

If you can store and push variables for defferent stages by add stage parameter to deploy
```bash
# will read secrets from secrets.prod.yml file
make deploy --stage prod 
# serverless deploy --stage prod
```

Also you can encript file by password
```bash
# Will generate secrets.dev.yml.encripted
make encript-dev "Password"
# serverless encrypt --stage dev --password "Password"
```

And add `secrets.dev.yml.encripted file to git

After new checkout this file must be decripted for deploy ny command
```bash
# Will decript file secrets.dev.yml.encripted to secrets.dev.yml
make decript-dev "Password"
# serverless decrypt --stage dev --password "Password"
```

### Tests
Test generation providet by [serverless-mocha-plugin](https://github.com/nordcloud/serverless-mocha-plugin)
> Currently cannot have any way to use typescript with jest powered by [serverless-jest-plugin](https://github.com/SC5/serverless-jest-plugin) or [jest-environment-serverless](https://github.com/fireeye/jest-environment-serverless). Use mocha until jest support will be realised to 1 version.

*Before test any function which depend on DynamoDB install and start local inctance of DynamoDB*

You can invoke test by command
```bash
make test
# sls webpack -o testBuild
# sls invoke test --root testBuild/service
#	rm -rf testBuild
```

or run tests to one function by
```bash
make test-fn hello 
# sls invoke test -f hello
```

also you can add test to existing function
```bash
make create-test hello
# sls create test -f hello
```

and when you create new handler it will create test for you automatically
```bash
make FN=newFunction HANDL=api/functionc/index create 
# sls create test -f newFunction --handler api/functionc/index
```

### Local development
If you want use AWS SDK or work with dynamodb on you machine you need `serverless-offline` and/or `serverleess-dynamodb-local`

`serverless-offline` - allow you run command
```bash
# Will start local inctance of serverless which you can curl (default on 3000 port)
make offline
# sls offline start
```

`serverless-dynamodb-client` will automatically handle enviroment and try to connect to local instance when run locally

#### Run offline not in docker
You need disable option which allow connect outside of container
```yml
# serverless.yml
custom:
  serverless-offline:
    # disable if you run offline outside of container
    host: "0.0.0.0" # allow connect outside 
```

#### Run DynamoDB not in container

By default in this bootstrap is included `serverleess-dynamodb-local` and `dynamo` container which will started automatically when you run `make console` and will connect on start

But if you want just start local instance DynamoDB on you machine or inside your conteiner without any other
Firstly you must install dynamodb on you machine
```bash
make dynamodb-install:
# sls dynamodb install
```

Then you disable options which tell `serverleess-dynamodb-local` connect to container
```yml
# serverless.yml
custom:
  dynamodb:
    start:
      # Please disable nearest options to start and connect in local machine
      host: dynamo # or the name of your Dynamo docker container
      port: "8000" # the port of our Dynamo docker container
      noStart: true
```

Then type this command to start dynamodb locally
```bash
# Will start local instance of DynamoDB (on 8000 port by default)
make dynamodb-start
# sls dynamodb start
```

#### Seed Database

You can add *seed* option which will inject data on start of inctance DynamoDB
```yml
# serverless.yml
custom:
  dynamodb:
    start:
      seed: true

    seed:
      domain:
        sources:
          - table: domain-widgets
            sources: [./domainWidgets.json]
          - table: domain-fidgets
            sources: [./domainFidgets.json]
      test:
        sources:
          - table: users
            rawsources: [./fake-test-users.json]
          - table: subscriptions
            sources: [./fake-test-subscriptions.json]
```

Which you can use on seed command to inject data
```bash
make dynamodb-seed domain,test
# sls dynamodb seed --seed=domain,test
```

Or seed on start of inctance
```bash
make dynamodb-start --seed=domain,test
# sls dynamodb start --seed=domain,test
```

*Not forget to add fake data `.json` files before make seed*

### Auto-scaling

#### AWS Lambda

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).