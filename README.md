# Serverless AWS Node Bootstrap
Base setup of enviroment and tools to start develop on lambda functions from zero (minimal) configuration

Contains:
* node enviroment setup 
* typescript setup 
* webpack serverless setup - to compile typescript and pack for deploy node_modules 
* Enviroment variables - setup for work with enviroment variables, you can setup their local and in produciton
* Encripted file variables - setup for store variables in encripted file 

## Servless from scratch tutorial

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
```

Login to serverless
```bash
make login
```

### Serverless tips

You can deploy faster by update only codee and dependencies of individual function
```bash
make deploy-fn
```

Get logs of deployed function
```bash
make logs
```

Invoke function in cloud and print their log
```bash
make invoke
```

Invoke function locally and print logs
```bash
make local
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
make local
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
serverless deploy --stage prod 
```

Also you can encript file by password
```bash
# Will generate secrets.dev.yml.encripted
make encript-dev <Your password>
```

And add `secrets.dev.yml.encripted file to git

After new checkout this file must be decripted for deploy ny command
```bash
# Will decript file secrets.dev.yml.encripted to secrets.dev.yml
make decript-dev
```

