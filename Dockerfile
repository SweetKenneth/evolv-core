# --------------------------------------------
#  Nuke Railway Cache: Maximum Overkill Mode
# --------------------------------------------

# Use Node as the base
FROM node:18-alpine

# Break the cache at layer 1
ARG CACHE_BREAKER=$(date)

# Install Bun (cache gets smashed here)
RUN apk add --no-cache curl bash && \
    echo "🚨 Cache Breaker: $CACHE_BREAKER 🚨" && \
    curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Working directory
WORKDIR /app

# Copy everything
COPY . .

# Force rebuild every time
RUN echo "🔥 full-rebuild-$CACHE_BREAKER" > /app/.force-rebuild

# Install dependencies with Bun
RUN bun install

# Build Next.js app
RUN bun run build

# Expose port
EXPOSE 3000

# Run the server
CMD ["bun", "run", "start"]
