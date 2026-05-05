# ─────────────────────────────────────────────
#  Dockerfile - CI/CD Learning App
#  Multi-stage: builder → production
# ─────────────────────────────────────────────

# ── Stage 1: Builder ──────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install ALL deps including devDependencies for lint/test
RUN npm ci

# Copy source code
COPY . .

# Run lint
RUN npm run lint

# Run tests
RUN npm test

# Run build
RUN npm run build

# ── Stage 2: Production ──────────────────────
FROM node:18-alpine AS production

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER appuser

EXPOSE 3000

ENV NODE_ENV=production

# Health check for Docker/K8s
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/src/app.js"]
