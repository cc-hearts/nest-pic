# Nest-Stencil

Nest-Stencil is a repository, a Nest template library that provides a basic setup for developing REST apis. The repository provides pre-configuration support for Swagger and some custom decorators that simplify API development.

## Features

- [x] Swagger documentation support out of the box
- [x] Custom decorators for cleaner, more concise code
- [x] Preconfigured setup for easier API development

## Getting Started

To get started with Nest-Stencil, simply clone the repository and install the necessary dependencies using npm:

```shell
git clone https://github.com/cc-hearts/nest-stencli.git
cd nest-stencil
npm install
```

This will install all of the necessary packages and dependencies needed to run the repository.

After that, add the 'app.develop. yaml' configuration to configure the database

```yaml
mysql:
  type:
  database:
  username:
  password:
  host:
  logging:
  port:

# token 加密字段
CRYPTO_SECRET_KEY:
CRYPTO_ALGORITHM:
CRYPTO_IV:

redis:
  port:
  host:
  password:
```

Next, you can start the server using the following command:

```shell
npm run start:dev
```

This will start the server in development mode, allowing you to make changes and see the results in real-time.

## Swagger Documentation

Nest-Stencil comes with built-in support for Swagger documentation, allowing you to easily document your API endpoints. To access the Swagger documentation, simply navigate to http://localhost:3000/api in your browser.
