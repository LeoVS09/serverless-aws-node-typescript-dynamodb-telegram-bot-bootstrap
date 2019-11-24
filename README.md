# serverless-aws-node-bootstrap
Base setup of enviroment and tools to start develop on lambda functions from zero (minimal) configuration

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