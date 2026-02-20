# Deployment Guide

This guide covers how to build and deploy your application as a high-performance, standalone binary using the Bun runtime.

---

## 🏗 Build Process

Since this project is optimized for performance, we use **Bun's Compilation** to bundle everything into a single executable.

### 1. Compile the Binary
Run the following command to bundle your code, dependencies, and the runtime into one file:

```bash
bun run build
```

**What this creates:**
- A single file named `server` in your root directory.
- No `node_modules` or `src` folders are needed after this step.

---

## 🚀 Deployment (Production)

To deploy your application, you only need the following minimum files on your target server:

```text
/deployment/
├── server            # The compiled binary
├── .env              # Your production config (copied from .env.prod)
└── storages/         # Database and log storage
```

---

## ⚙️ Environment Configuration

By default, the compiled binary looks for a file named `.env` in the same directory. Since this project uses specific stage files, you must handle the configuration using one of these methods:

### 1. Preparation: Set Permissions
Before running the server on Linux, ensure the binary has executable permissions:
```bash
chmod +x ./server
```

### 2. Choose Execution Method

#### Method A: The Standard Way (Recommended)
Copy your production template results to the standard `.env` name. The binary will load this automatically.
```bash
cp .env.prod .env
./server
```

#### Method B: Explicit Stage Loading
Tell Bun exactly which file to use without renaming it:
```bash
BUN_ENV_FILE=.env.prod ./server
```

---

## 📦 Docker Deployment (Optional)

If you prefer using Docker, here is the optimized workflow:

```dockerfile
# Build Stage
FROM oven/bun:latest as builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

# Final Stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/server .
COPY .env.prod .env

# Data persistence
RUN mkdir -p storages/logs storages/database/sqlite

EXPOSE 8080
CMD ["./server"]
```

---

## 🧹 Maintenance & Logging

- **Logs**: Located in `storages/logs/` categorized by date.
- **SQLite**: The database file is in `storages/database/sqlite/dev.db`.
- **Systemd**: For production, it is recommended to run the binary as a background service using `systemd` or `pm2`.

### Example Systemd Service (`/etc/systemd/system/myapp.service`):
```ini
[Unit]
Description=Hono Multi-DB API
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/app
ExecStart=/path/to/app/server
Restart=always
Environment=BUN_ENV_FILE=.env.prod

[Install]
WantedBy=multi-user.target
```

---

## ✅ Checklist for Production
- [ ] `DB_{TARGET}_ENABLED` toggles are set correctly in `.env`.
- [ ] Database credentials (PG, MySQL, Mongo) are correct.
- [ ] Redis is accessible at the configured host.
- [ ] Port `8080` (or your custom port) is open in the firewall.
- [ ] `NODE_ENV` is set to `production`.
