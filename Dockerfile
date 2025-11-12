# --- Dockerfile ---
FROM node:20-alpine

# Set work directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Environment variable
ENV NODE_ENV=production
EXPOSE 3000

# Start app
CMD ["node", "src/server.js"]
