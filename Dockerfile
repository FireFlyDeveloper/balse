FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Expose the port your app runs on (modify if needed)
EXPOSE 3001

# Start the application
CMD ["bun", "run", "dist/index.js"]
