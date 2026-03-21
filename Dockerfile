FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN rm -f .env.example

ENV NODE_ENV=production

EXPOSE 5002

CMD ["node", "server.js"]
