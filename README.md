# Testing Node App with Jest

Using Jest and Supertest to add unit and functional test to Node App.

| <div style="width:130px">Test</div>                                                                             | Api Demo Result                                                                                                 |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ![image](https://user-images.githubusercontent.com/29106855/109544234-4fa71d80-7a95-11eb-8c93-57a01a0a35b4.png) | ![image](https://user-images.githubusercontent.com/29106855/124027580-a9264700-d9b8-11eb-9f30-0a200f99f8ff.png) |

## Useful npm scripts

### Run the tests

There are two types of tests, the unit tests and the functional tests. These can be executed as follows.

-   Run unit tests only

    ```console
    $ npm run test:unit
    $ npm run test:unit$ npm run test:unit

    ```

-   Run functional tests only

    ```console
    $ npm run test:functional
    ```

-   Run both unit and functional tests

    ```console
    $ npm run test
    ```

### Run the application

Run the application which will be listening on port `3000`.

```console
$ npm start
```

## Useful docker comands

### Run docker compose

There are two environments in Docker Compose. These can be executed as follows.

-   Run development environment

    ```console
    $ docker-compose -f docker-compose.dev.yml up --build
    ```

-   Run production environment

    ```console
    $ docker-compose -f docker-compose.yml up --build
    ```

-   Run tests inside Docker container

    ```console
    $ docker build -t node-docker --target test .
    ```

https://docs.microsoft.com/en-us/learn/modules/deploy-nodejs/
https://github.com/MicrosoftDocs/node-essentials



this is for the trigger purposesdsmnv 
