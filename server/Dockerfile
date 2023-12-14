# Node.js base image
FROM node:20.10.0-alpine3.17

# Set working directory
WORKDIR /app/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# # Expose the port on which the Node.js application will run
# EXPOSE $SERVER_PORT

# Start the application
CMD ["npm", "start"]
