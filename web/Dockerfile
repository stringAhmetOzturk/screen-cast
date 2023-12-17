# Node.js base image
FROM node:20.10.0-alpine3.17

# Set working directory
WORKDIR /app/web

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# # Expose the port on which the React application will run
EXPOSE $REACT_APP_FRONTEND_PORT

# Start the application
CMD ["npm", "start"]