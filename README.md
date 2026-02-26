# Exchange Platform

A cryptocurrency exchange platform built from scratch with a microservices architecture.


## Architecture
- **apps/http** - HTTP API server for orders, depth, and tickers
- **apps/ws** - WebSocket server for real-time market data streaming
- **apps/web** - Next.js frontend application
- **packages/db** - Prisma database schema and client

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose (for PostgreSQL)
- Redis (running locally on port 6379)
- pnpm

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Copy the example environment files:

```bash
# For HTTP server
cp apps/http/.env.example apps/http/.env

# For WebSocket server
cp apps/ws/.env.example apps/ws/.env

# For Web app
cp apps/web/.env.example apps/web/.env.local

# For Database
cp packages/db/.env.example packages/db/.env
```

### 3. Start Docker Services

Start PostgreSQL:

```bash
docker compose up -d
```

Verify service is running:

```bash
docker compose ps
```

Make sure Redis is running locally on port 6379:

```bash
redis-cli ping
# Should return: PONG
```

### 4. Setup Database

Run Prisma migrations:

```bash
cd packages/db
pnpm prisma migrate dev
pnpm prisma generate
```

### 5. Start Development Servers

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter http dev      # HTTP API on port 3001
pnpm --filter ws dev         # WebSocket on port 3002
pnpm --filter web dev        # Web app on port 3000
```

## Environment Variables

### HTTP Server (`apps/http/.env`)
- `HTTP_PORT` - HTTP API server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `REDIS_URL` - Redis connection URL (default: redis://localhost:6379)
- `DATABASE_URL` - PostgreSQL connection string

### WebSocket Server (`apps/ws/.env`)
- `WS_PORT` - WebSocket server port (default: 3002)
- `REDIS_URL` - Redis connection URL (default: redis://localhost:6379)
- `DATABASE_URL` - PostgreSQL connection string

### Web App (`apps/web/.env.local`)
- `NEXT_PUBLIC_WS_URL` - WebSocket server URL (default: ws://localhost:3002)
- `NEXT_PUBLIC_API_URL` - HTTP API URL (default: http://localhost:3001)
- `REDIS_URL` - Redis connection URL (default: redis://localhost:6379)
- `DATABASE_URL` - PostgreSQL connection string

## Services

### PostgreSQL (Docker)
- **Port:** 5432
- **User:** postgres
- **Password:** postgres
- **Database:** exchange_db

**Managing PostgreSQL:**
```bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL
docker compose down

# View logs
docker compose logs -f postgres

# Stop and remove volumes (⚠️ deletes all data)
docker compose down -v
```

### Redis (Local)
- **Port:** 6379
- Running on your local machine (not in Docker)

**Install Redis locally (if not installed):**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# Verify
redis-cli ping
```

## API Endpoints

### HTTP API (port 3001)

- `POST /order` - Create new order
- `DELETE /order` - Cancel order
- `GET /depth?symbol=SYMBOL` - Get order book depth
- `GET /tickers?symbol=SYMBOL` - Get ticker data

### WebSocket (port 3002)

Subscribe to market data streams:

```json
{
  "method": "SUBSCRIBE",
  "params": ["BTCUSDT@ticker", "BTCUSDT@depth", "BTCUSDT@trade", "BTCUSDT@kline"]
}
```

## Development

### Database Changes

After modifying the Prisma schema:

```bash
cd packages/db
pnpm prisma migrate dev --name your_migration_name
pnpm prisma generate
```

### Type Checking

```bash
pnpm check-types
```

### Linting

```bash
pnpm lint
```

### Build

```bash
pnpm build
```

## Project Structure

```
.
├── apps/
│   ├── http/          # HTTP API server
│   ├── ws/            # WebSocket server
│   └── web/           # Next.js frontend
├── packages/
│   ├── db/            # Prisma schema & client
│   └── ui/            # Shared UI components
├── docker-compose.yml # Docker services configuration
└── README.md
```

## Tech Stack

- **Backend:** Node.js, Express, WebSocket
- **Frontend:** Next.js, React, TailwindCSS
- **Database:** PostgreSQL (Prisma ORM)
- **Cache/Queue:** Redis
- **Monorepo:** Turborepo, pnpm workspaces
