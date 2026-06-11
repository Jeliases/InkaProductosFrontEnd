# ETAPA 1: Compilación (Build)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# ETAPA 2: Servidor Web (Nginx)
# ... (tu configuración actual del build stage) ...

FROM nginx:alpine
COPY --from=build /app/dist/inka-frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]