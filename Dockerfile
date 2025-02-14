# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Add default api proxy path
ENV VITE_MYFIN_BASE_API_URL=/api

# Build the app
RUN npm run build

# Serve stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Add metadata
LABEL maintainer="José Valdiviesso <me@zmiguel.me>"
LABEL author="José Valdiviesso <me@zmiguel.me>"
LABEL version="7.5.2"
LABEL description="MyFin Frontend Application"
LABEL org.opencontainers.image.authors="José Valdiviesso <me@zmiguel.me>"
LABEL org.opencontainers.image.version="7.5.2"
LABEL org.opencontainers.image.title="MyFin Frontend"
LABEL org.opencontainers.image.description="Web frontend for the personal finances platform that'll help you budget, keep track of your income/spending and forecast your financial future."
LABEL org.opencontainers.image.source="https://github.com/afaneca/myfin"

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

COPY docker-entrypoint.sh /

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ | grep -q '<title>MyFin Budget</title>' || exit 1

# Start nginx
ENTRYPOINT [ "/docker-entrypoint.sh" ]
