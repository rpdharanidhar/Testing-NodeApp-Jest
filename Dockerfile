# syntax=docker/dockerfile:1
FROM node:12-alpine as base
WORKDIR /app
COPY package* ./

FROM base as test 
RUN npm ci
COPY . .
RUN npm run test:check

FROM base as prod
RUN npm prune --production
COPY . .
CMD ["node", "src/index.js"]