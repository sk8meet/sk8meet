# Base stage for dependencies
FROM node:18-alpine AS base
WORKDIR /workspace/frontend
COPY package*.json ./

# Development stage
FROM base AS development
# Install Git for version control
RUN apk add --no-cache git
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /workspace/frontend
COPY --from=builder /workspace/frontend/next.config.js ./
COPY --from=builder /workspace/frontend/public ./public
COPY --from=builder /workspace/frontend/.next ./.next
COPY --from=builder /workspace/frontend/node_modules ./node_modules
COPY --from=builder /workspace/frontend/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]