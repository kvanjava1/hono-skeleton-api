# Hono Multi-Database API

A production-ready Hello World API template with multi-database support (MySQL, MongoDB, SQLite).

## Features

- **Bun** runtime for fast performance
- **Hono** web framework
- **TypeScript** for type safety
- **Multi-database support**: MySQL, MongoDB, SQLite
- **Migration system**: Database migrations for all databases
- **Security**: Helmet headers, CORS, Rate limiting
- **Logging**: File-based logging with daily rotation
- **Password hashing**: bcrypt
- **Layered architecture**: Clean separation of concerns

## Quick Start

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env.dev

# Run migrations
bun run migrate:up

# Start development server
bun run dev

# Seed databases
bun run seed
```

## Documentation

- [Getting Started](./docs/GETTING_STARTED.md)
- [API Documentation](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Migration Guide](./docs/MIGRATIONS.md)
- [Background Queues](./docs/QUEUES.md)

## Available Scripts

### Server

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run start` | Start production server |

### Database Seeding

| Script | Description |
|--------|-------------|
| `bun run seed` | Seed all databases |
| `bun run seed:mysql` | Seed MySQL only |
| `bun run seed:mongo` | Seed MongoDB only |
| `bun run seed:sqlite` | Seed SQLite only |

### Migrations

| Script | Description |
|--------|-------------|
| `bun run migrate` | Show migration help |
| `bun run migrate:up` | Run all pending migrations |
| `bun run migrate:down` | Rollback last migration |
| `bun run migrate:mysql` | Run MySQL migrations only |
| `bun run migrate:mongo` | Run MongoDB migrations only |
| `bun run migrate:sqlite` | Run SQLite migrations only |

### Migration CLI Examples

```bash
# Create new migration
bun run migrate create mysql add_posts_table

# Run specific database migrations
bun run migrate up mysql

# Rollback specific number
bun run migrate down mysql 2
```

## Project Structure

```
src/
├── app.ts              # Hono app configuration
├── index.ts            # Server entry point
├── configs/            # Configuration files
├── database/           # Database connections
├── models/             # Data models
├── repositories/       # Data access layer
├── services/           # Business logic
├── controllers/        # Request handlers
├── routes/             # Route definitions
├── middlewares/        # Middleware functions
└── utils/              # Utility functions

migrations/
├── mysql/files/        # MySQL migration files
├── mongo/files/        # MongoDB migration files
└── sqlite/files/       # SQLite migration files

seeders/                # Database seeders
storages/               # Logs & SQLite database
```

## License

MIT
