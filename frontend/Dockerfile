# Stage 1: Base setup
FROM node:alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Stage 2: Build 
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
