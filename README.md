# serverless-aws-node-bootstrap
Base setup of enviroment and tools to start develop on lambda functions from zero (minimal) configuration

Contains:
* node enviroment setup 
* typescript setup 
* webpack serverless setup - to compile typescript and pack for deploy node_modules 

## Fast setup | Servless from scratch tutorial
Just dogo step by step and you will deploy you function to AWS

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
```

## Setup local enviroment
This command will generate configuration enviroment `.env` file which will be used by docker and serveless

```bash
make setup
```

## In docker isolated linux development
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

## Deploy you serverless functions
Commands to deploy you function

>Note login to serverless when deploy first time
Deploy to aws cloud by serverless 
```bash
make deploy
```

Login to serverless
```bash
make login
```