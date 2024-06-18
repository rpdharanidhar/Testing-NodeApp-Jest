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
RUN index.js
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
RUN apk add --no-cache curl \
    && curl -sfL https://gobinaries.com/tj/node-prune | sh
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN /usr/local/bin/node-prune
EXPOSE 8080
CMD ["npm", "start"]

FROM gcr.io/distroless/nodejs:12 as production
EXPOSE 3000
COPY --from=build /app /app
WORKDIR /app
CMD ["src/index.js"]

# EXPOSE 8080
# CMD ["npm", "start"]

FROM openjdk:11-jdk-slim

# Set environment variables
ENV FORTIFY_HOME=/opt/fortify
ENV PATH=$FORTIFY_HOME/bin:$PATH

# Copy the Fortify SCA installer into the image
COPY Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz /tmp/

# Install dependencies
RUN apt-get update && \
    apt-get install -y tar && \
    mkdir -p $FORTIFY_HOME && \
    tar -xzvf /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz -C $FORTIFY_HOME --strip-components=1 && \
    rm -rf /var/lib/apt/lists/* /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz
RUN apt-get update && apt-get install -y musl

# Set up entrypoint
ENTRYPOINT ["sourceanalyzer"]
