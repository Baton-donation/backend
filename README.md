# backend

[![Coverage](https://codecov.io/gh/Baton-donation/backend/coverage.svg?branch=main)](https://codecov.io/gh/Baton-donation/backend?branch=main)

## 🧰 Development

Copy `.env.example` to `.env` and update as necessary. Then:

```bash
# install dependencies
yarn install

# then:
# start dev server in watch mode
yarn dev

# and you can:

# run tests
yarn test

# run tests in watch mode
yarn test:watch

# run e2e tests
yarn test:e2e

# generate migrations for schema changes
yarn migrations:generate

# apply migrations
yarn migrations:run
```

Pushes to the main branch will automatically deploy to the production environment after checks pass.
