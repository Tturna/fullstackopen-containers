FROM node:16 AS test-stage
WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV=test

RUN CI=true npm run test

FROM node:16 AS build-stage
WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api

RUN npm ci

RUN npm run build

FROM nginx:1.20-alpine
# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html