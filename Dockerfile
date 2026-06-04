# Use Node.js 20 Docker image as base
FROM node:22

# Needed for front-end builds
ARG VITE_POWERSYNC_URL=http://localhost:8080
ARG VITE_CONVEX_URL=http://localhost:3210
ARG VITE_CONVEX_SITE_URL=http://localhost:3211

# Needed for running the Convex backend dev/deploy commands (in backend mode)
# This is named for the Convex CLI which requires this variable name
ENV CONVEX_SELF_HOSTED_URL=http://localhost:3210

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock*.yaml ./

RUN corepack enable

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the demo launcher code to the container
COPY convex/ convex/
COPY public public
COPY src src
COPY vite.config.mts vite.config.mts
COPY tsconfig.json tsconfig.json


# Build TypeScript code
RUN pnpm run build

# Command to run the application
CMD ["pnpm", "preview", "--host"]