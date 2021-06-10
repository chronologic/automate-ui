[<img src="https://s3.amazonaws.com/chronologic.network/ChronoLogic_logo.svg" width="128px">](https://github.com/chronologic)

# Automate UI

⏱️ This repositery contains UI source code for [Automate](https://blog.chronologic.network/automate/home).

API source code can be found [here](https://github.com/chronologic/automate-api)

📌 **LIVE version is available here** [https://automate.chronologic.network/](https://automate.chronologic.network/)

**ProductHunt is** [here](https://www.producthunt.com/posts/automate-1)

❓ **Tutorials and help are** [here](https://blog.chronologic.network/automate/home)

## Running the project

Install with `npm install`

Start development instance with `npm start`

Create production build with `npm run build`

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, a `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name                     | Type      | Default | Description                                                   |
| ------------------------ | --------- | ------- | ------------------------------------------------------------- |
| `REACT_APP_CHAIN_ID`     | `number`  | `1`     | Ethereum chain ID (`1` = mainnet)                             |
| `REACT_APP_API_URL`      | `string`  |         | URL of the [API](https://github.com/chronologic/automate-api) |
| `DATABASE_URL`           | `string`  |         | PostgreSQL connection string                                  |
| `REACT_APP_ALLOW_SIGNUP` | `boolean` |         | Whether to allow new users to sign up                         |
