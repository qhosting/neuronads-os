# --- NEURONADS OS | DOCKER INFRASTRUCTURE ---
# Nodo de Producción Optimizado para AdTech Scaling

FROM node:20-alpine AS base

# Instalación de dependencias del sistema para librerías nativas y herramientas de red
RUN apk add --no-cache libc6-compat curl

# Directorio de trabajo del Córtex NeuronAds
WORKDIR /app

# --- INSTALACIÓN DE DEPENDENCIAS ---
# Copiamos el manifiesto de dependencias
COPY package.json ./

# Instalación de dependencias de producción
# Se usa 'npm install --omit=dev' porque no hay un archivo package-lock.json presente
RUN npm install --omit=dev

# --- DESPLIEGUE DE CÓDIGO ---
# Copiamos el resto de los módulos y el código fuente
COPY . .

# Seguridad: Cambiamos el dueño de los archivos al usuario 'node'
RUN chown -R node:node /app

# --- CONFIGURACIÓN DE ENTORNO ---
ENV NODE_ENV=production
ENV PORT=3000

# --- OPERATIVIDAD ---
# Exponer el puerto de comunicación del Nodo Central
EXPOSE 3000

# Usuario no privilegiado para ejecución segura
USER node

# Healthcheck: Verificación periódica del estado del Córtex Central
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicio del Nodo Operativo NeuronAds
CMD ["node", "server.js"]
