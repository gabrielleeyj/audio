FROM node:18

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application's port
EXPOSE 3000

# Install nodemon globally to handle hot reloading
RUN npm install -g nodemon

# Use nodemon for hot-reloading
CMD ["nodemon", "app.js"]

