FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev
COPY .env.example ./.env
EXPOSE 3000
CMD ["node", "dist/server.js"]
