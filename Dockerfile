# Use Node as the base
FROM node:18-alpine

# Install bun
RUN apk add --no-cache curl bash && \
    curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

# Copy everything
COPY . .

# Install deps using bun
RUN bun install

# Build the Next.js app
RUN bun run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "start"]
