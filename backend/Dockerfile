FROM node:alpine

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the application's port
EXPOSE 3001

# Copy the .env file
COPY .env .env

CMD ["node", "app.js"]

