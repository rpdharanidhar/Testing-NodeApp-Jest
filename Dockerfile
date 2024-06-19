# # # # syntax=docker/dockerfile:1
# # # FROM node:12-alpine as base

# # # WORKDIR /app
# # # COPY package* ./
# # # RUN npm install
# # # COPY . .

# # # FROM base as test 
# # # RUN npm run test

# # # FROM base as development 
# # # CMD [ "npm", "run", "dev"]

# # # FROM base as build 
# # # RUN npm prune --production
# # # RUN index.js
# # # RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
# # # RUN apk add --no-cache curl \
# # #     && curl -sfL https://gobinaries.com/tj/node-prune | sh
# # # RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
# # # RUN /usr/local/bin/node-prune
# # # EXPOSE 8080
# # # CMD ["npm", "start"]

# # # FROM gcr.io/distroless/nodejs:12 as production
# # # EXPOSE 3000
# # # COPY --from=build /app /app
# # # WORKDIR /app
# # # CMD ["src/index.js"]

# # # # EXPOSE 8080
# # # # CMD ["npm", "start"]

# # # FROM openjdk:11-jdk-slim

# # # # Set environment variables
# # # ENV FORTIFY_HOME=/opt/fortify
# # # ENV PATH=$FORTIFY_HOME/bin:$PATH

# # # # Copy the Fortify SCA installer into the image
# # # COPY Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz /tmp/

# # # # Install dependencies
# # # RUN apt-get update && \
# # #     apt-get install -y tar && \
# # #     mkdir -p $FORTIFY_HOME && \
# # #     tar -xzvf /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz -C $FORTIFY_HOME --strip-components=1 && \
# # #     rm -rf /var/lib/apt/lists/* /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz
# # # RUN apt-get update && apt-get install -y musl

# # # # Set up entrypoint
# # # ENTRYPOINT ["sourceanalyzer"]


# # # syntax=docker/dockerfile:1
# # # Base image with Node.js
# # FROM node:12-alpine as base

# # WORKDIR /app
# # COPY package* ./
# # RUN npm install
# # COPY . .

# # # Stage for running tests
# # FROM base as test 
# # RUN npm run test

# # # Development stage
# # FROM base as development 
# # CMD ["npm", "run", "dev"]

# # # Build stage
# # FROM base as build 
# # RUN npm prune --production
# # # RUN sudo ip link set eth0 up && sudo ip addr add 192.168.1.100/24 dev eth0 && sudo ip route add default via 192.168.1.1
# # RUN ifconfig
# # RUN node index.js
# # RUN apk update && apk add --no-cache curl bash \
# #     && rm -rf /var/cache/apk/*
# # RUN curl -sfL https://gobinaries.com/tj/node-prune | sh
# # RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
# # RUN /usr/local/bin/node-prune
# # EXPOSE 8080
# # CMD ["npm", "start"]

# # # Production stage
# # FROM gcr.io/distroless/nodejs:12 as production
# # EXPOSE 3000
# # COPY --from=build /app /app
# # WORKDIR /app
# # CMD ["src/index.js"]

# # # Fortify SCA setup
# # FROM openjdk:11-jdk-slim AS fortify

# # # Set environment variables
# # ENV FORTIFY_HOME=/opt/fortify
# # ENV PATH=$FORTIFY_HOME/bin:$PATH

# # # Copy the Fortify SCA installer into the image
# # COPY Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz /tmp/

# # # Install dependencies and Fortify SCA
# # RUN apt-get update && apt-get install -y tar musl && \
# #     mkdir -p $"FORTIFY_HOME" && \
# #     tar -xzvf /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz -C $"FORTIFY_HOME" --strip-components=1 && \
# #     rm -rf /var/lib/apt/lists/* /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz

# # # Set up entrypoint for Fortify SCA
# # ENTRYPOINT ["sourceanalyzer"]


# # syntax=docker/dockerfile:1
# # Base image with Node.js
# FROM node:12-buster-slim as base

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .

# # Stage for running tests
# FROM base as test
# RUN npm run test

# # Development stage
# FROM base as development
# CMD ["npm", "run", "dev"]

# # Build stage
# FROM base as build
# RUN npm prune --production
# COPY . .
# RUN apt-get update && apt-get install -y curl bash && rm -rf /var/lib/apt/lists/*
# RUN curl -sfL https://gobinaries.com/tj/node-prune | sh
# RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
# RUN /usr/local/bin/node-prune
# EXPOSE 8090
# CMD ["npm", "start"]

# # Production stage
# FROM gcr.io/distroless/nodejs:12 as production
# EXPOSE 3000
# COPY --from=build /app /app
# WORKDIR /app
# CMD ["src/index.js"]

# # Fortify SCA setup
# FROM openjdk:11-jdk-slim AS fortify

# # Set environment variables
# ENV FORTIFY_HOME=/opt/fortify
# ENV PATH=$FORTIFY_HOME/bin:$PATH

# # Copy the Fortify SCA installer into the image
# COPY Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz /tmp/

# # Install dependencies and Fortify SCA
# RUN apt-get update && apt-get install -y tar musl && \
#     mkdir -p $FORTIFY_HOME && \
#     tar -xzvf /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz -C $FORTIFY_HOME --strip-components=1 && \
#     rm -rf /var/lib/apt/lists/* /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz

# # Set up entrypoint for Fortify SCA
# ENTRYPOINT ["sourceanalyzer"]


# syntax=docker/dockerfile:1
# Base image with Node.js
FROM node:12-buster-slim as base

WORKDIR /app
COPY package*.json ./

# Update npm to the latest version
RUN npm install -g npm@latest

RUN npm install
COPY . .

# Stage for running tests
FROM base as test
RUN npm run test

# Development stage
FROM base as development
CMD ["npm", "run", "dev"]

# Build stage
FROM base as build
RUN npm prune --production
COPY . .
RUN apt-get update && apt-get install -y curl bash && rm -rf /var/lib/apt/lists/*
RUN curl -sfL https://gobinaries.com/tj/node-prune | sh
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN /usr/local/bin/node-prune
EXPOSE 8080
CMD ["npm", "start"]

# Production stage
FROM gcr.io/distroless/nodejs:12 as production
EXPOSE 3000
COPY --from=build /app /app
WORKDIR /app
CMD ["src/index.js"]

# Fortify SCA setup
FROM openjdk:11-jdk-slim AS fortify

# Set environment variables
ENV FORTIFY_HOME=/opt/fortify
ENV PATH=$FORTIFY_HOME/bin:$PATH

# Copy the Fortify SCA installer into the image
COPY Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz /tmp/

# Install dependencies and Fortify SCA
RUN apt-get update && apt-get install -y tar musl && \
    mkdir -p $FORTIFY_HOME && \
    tar -xzvf /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz -C $FORTIFY_HOME --strip-components=1 && \
    rm -rf /var/lib/apt/lists/* /tmp/Fortify_SCA_and_Apps_<version>_linux_x64.tar.gz

# Set up entrypoint for Fortify SCA
ENTRYPOINT ["sourceanalyzer"]
