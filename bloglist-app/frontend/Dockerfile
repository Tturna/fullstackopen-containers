FROM node:16 AS test-stage
WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV=test

RUN CI=true npm run test

FROM node:16 AS build-stage
WORKDIR /usr/src/app

COPY . .

ENV VITE_APP_BACKEND_URL=http://localhost:8080/api

RUN npm ci

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html