# Use Node as the base
FROM node:18-alpine

# === FORCE FRESH BUILD ===
# Installing bun cleanly (extra echo breaks cache)
RUN apk add --no-cache curl bash && \
    echo "force-build-$(date)" && \
    curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies with Bun
RUN bun install

# Build the Next.js app
RUN bun run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "start"]

