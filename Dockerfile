FROM node:20.10-alpine as buildWeb

# Set working directory
WORKDIR /app/web

# Copy package.json and package-lock.json
COPY ./web/package*.json /app/web/

# Install dependencies
RUN npm install

# Copy the application code
COPY ./web .

# Start the application
RUN npm run build


# Node.js base image
FROM node:20.10-alpine as buildServer

# Set working directory
WORKDIR /app/server

# Copy package.json and package-lock.json
COPY ./server/package*.json /app/server/

# Install dependencies
RUN npm install

# Copy the application code
COPY ./server .
COPY --from=buildWeb /app/web/build /app/server/public

# # Expose the port on which the Node.js application will run
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
