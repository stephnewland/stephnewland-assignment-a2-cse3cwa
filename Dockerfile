# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Expose the port Render will use
EXPOSE 3000

# Ensure NODE_ENV is production
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
