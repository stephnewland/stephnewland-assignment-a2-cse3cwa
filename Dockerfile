# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
