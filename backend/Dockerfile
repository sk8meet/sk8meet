# Base stage for dependencies
FROM node:18-alpine AS base
WORKDIR /workspace/backend
COPY package*.json ./

# Development stage
FROM base AS development
# Install Git for version control
RUN apk add --no-cache git bash
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /workspace/backend
COPY --from=builder /workspace/backend/dist ./dist
COPY --from=builder /workspace/backend/node_modules ./node_modules
COPY --from=builder /workspace/backend/package.json ./package.json
COPY --from=builder /workspace/backend/prisma ./prisma
EXPOSE 4000
CMD ["npm", "start"]