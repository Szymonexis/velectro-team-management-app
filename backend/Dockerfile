FROM node:20 AS node

WORKDIR /backend

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .
COPY .env.prod.example .env
RUN chmod +x entrypoint.sh

# Generate Prisma client
RUN npx prisma generate

# Build the Nest.js application
RUN npm run build

# Cleanup
RUN rm -rf ./src package-lock.json package.json nest-cli.json

EXPOSE 3030

# Start the application
CMD ["./entrypoint.sh"]
