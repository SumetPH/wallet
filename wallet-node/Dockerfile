# Use the official Node.js image
FROM node:18.18.0-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY . .

# Install dependencies
RUN npm install


ENV DATABASE_URL=postgres://sumetph@host.docker.internal/wallet

RUN npm run db:pull
RUN npm run build

COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Run the web service on container startup.
CMD ["node", "dist/index.js"]