# Stage 1: Build with full dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --legacy-peer-deps
COPY src ./src
RUN npm run build

# Stage 2: Runtime with only production deps
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
# Install only prod dependencies
RUN npm ci --omit=dev --legacy-peer-deps
# Copy env file placeholder (override at runtime)
COPY .env.example ./.env
EXPOSE 3000
CMD ["node", "dist/main.js"]
