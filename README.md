[<img src="https://s3.amazonaws.com/chronologic.network/ChronoLogic_logo.svg" width="128px">](https://github.com/chronologic)

# Sentinel UI

This contains UI project for Sentinel.

API project here [https://github.com/chronologic/sentinel-api](https://github.com/chronologic/sentinel-api)

## How to start

`yarn install`

To start the TS and SCSS watcher for development

`yarn start`

To create a production build

`yarn build`

## Development

UI uses `.env.development` to set `REACT_APP_API_URL=http://localhost:3001` which is expected URL of API project.

## Deployment

Instructions https://dashboard.heroku.com/apps/cl-sentinel/deploy/heroku-git

UI uses `.env.production` to set `REACT_APP_API_URL=https://cl-sentinel-api.herokuapp.com` which is expected URL of API project.

## Stack

Typescript
React
Carbon Components

Created with `create-react-app --scripts-version=react-scripts-ts`

HOWTO instructions here https://github.com/Microsoft/TypeScript-React-Starter/blob/master/README-CRA.md
