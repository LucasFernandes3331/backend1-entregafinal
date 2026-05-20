FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependencias de producción con lockfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiar el código fuente
COPY . .

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/products', res => res.statusCode===200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1));"

CMD ["node", "src/servidor.js"]
