# --- NEURONADS OS | DOCKER INFRASTRUCTURE ---
# Nodo de Producción Optimizado para AdTech Scaling

# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
# Instalación de dependencias del sistema
RUN apk add --no-cache libc6-compat curl

# Copiamos manifiestos y todo el código fuente
COPY package*.json ./
# Instalamos todas las dependencias (incluyendo dev para Vite)
RUN npm install
COPY . .
# Construimos la aplicación React (Vite -> dist)
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat curl

# Instalación de dependencias de producción únicamente
COPY package*.json ./
RUN npm install --omit=dev

# Copiamos archivos compilados y del servidor
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Seguridad: Cambiamos el dueño de los archivos al usuario 'node'
RUN chown -R node:node /app

# --- CONFIGURACIÓN DE ENTORNO ---
ENV NODE_ENV=production
ENV PORT=3000

# --- OPERATIVIDAD ---
EXPOSE 3000
USER node

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicio
CMD ["node", "server.js"]
