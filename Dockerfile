# syntax=docker/dockerfile:1
FROM node:12-alpine as base

WORKDIR /app
COPY package* ./
RUN npm install
COPY . .

FROM base as test 
RUN npm run test

FROM base as development 
CMD [ "npm", "run", "dev"]

FROM base as build 
RUN npm prune --production
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
RUN apk add --no-cache curl \
    && curl -sfL https://gobinaries.com/tj/node-prune | sh
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN /usr/local/bin/node-prune

FROM gcr.io/distroless/nodejs:12 as production
EXPOSE 3000
COPY --from=build /app /app
WORKDIR /app
# CMD ["src/index.js"]

EXPOSE 8080
CMD ["npm", "start"]