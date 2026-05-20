# Use lightweight Node Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose the server port (usually 3000 for Node/Express)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]