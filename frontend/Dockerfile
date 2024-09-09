# Stage 1: Base setup
FROM node:lts-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Stage 2: Build for production
FROM base AS build
RUN npm run build

# Stage 3: Serve with Nginx for production
FROM nginx:latest AS prod

# Copy the built app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]

# Stage 4: Development (hot-reload)
FROM base AS dev

# Install development dependencies and start dev server
RUN npm install
EXPOSE 3000

CMD ["npm", "start"]

