# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /app
RUN apk add --no-cache python g++ make
COPY package* ./
RUN npm install --production
COPY . .
CMD ["node", "src/index.js"]