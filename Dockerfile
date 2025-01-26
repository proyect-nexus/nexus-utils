FROM node:14

# Instalar las dependencias necesarias para las fuentes
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    fontconfig

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de la aplicación
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
