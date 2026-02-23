# 🛠️ M2M Client Management Guide

This guide describes how to manage API clients using the enhanced CLI utility suite. These commands must be run from the server terminal with access to the SQLite database.

## 📋 Commands Overview

| Command | Description |
| :--- | :--- |
| **[List All](#1-list-all-clients)** | Overview of all registered clients. |
| **[Add](#2-add-new-client)** | Register a new client. |
| **[Check](#3-check-client-details)** | Detailed info and Today's usage stats. |
| **[Logs](#4-view-activity-logs)** | Audit request/response history. |
| **[IPs](#5-manage-allowed-ips-addremove)** | Manage Allowed IP addresses. |
| **[Status](#6-update-status-suspendactivate)** | Suspend or activate a client. |
| **[Delete](#7-delete-client)** | Permanently remove a client. |

---

### 1. List All Clients
Get a quick overview of every client in the system.
```bash
bun run src/utils/m2m/list.ts
```

### 2. Add New Client
Register a new service or website for M2M access.
```bash
bun run src/utils/m2m/add.ts "<name>" "<clientId>" "<clientSecret>" [limit] [ips]
```

### 3. Check Client Details
Lookup existing client configuration and see **Today's** usage percentage.
```bash
bun run src/utils/m2m/check.ts "<name>"
```

### 4. View Activity Logs
Audit the recent request history. Supports filtering and custom limits.
```bash
# View last 20 logs (Default)
bun run src/utils/m2m/logs.ts

# View last 50 logs
bun run src/utils/m2m/logs.ts 50

# View last 50 logs for a specific client
bun run src/utils/m2m/logs.ts 50 "my_client_id"
```

### 5. Manage Allowed IPs (Add/Remove)
Precisely control which IPs can access your API.

```bash
# Add a single IP
bun run src/utils/m2m/ip.ts add "<clientId>" "127.0.0.1"

# Remove a single IP
bun run src/utils/m2m/ip.ts remove "<clientId>" "127.0.0.1"

# Clear all IPs (Allow any IP)
bun run src/utils/m2m/ip.ts clear "<clientId>"
```

### 6. Update Status (Suspend/Activate)
Instantly block or restore access for a client.
```bash
# Suspend a client
bun run src/utils/m2m/status.ts "<clientId>" "suspended"

# Activate a client
bun run src/utils/m2m/status.ts "<clientId>" "active"
```

### 7. Delete Client
Permanently remove a client from the system.
```bash
bun run src/utils/m2m/delete.ts "<clientId>" --confirm
```

---

## ⚙️ Configuration Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Descriptive name of the service (used for lookups). |
| `clientId` | String | Yes | Unique identifier (API key). |
| `clientSecret` | String | Yes | Plaintext secret. **Automatically hashed via bcrypt**. |
| `limit` | Number | No | Max requests per hour. Default: `1000`. |
| `ips` | String | No | Comma-separated IPs. Leave blank for any IP. |

[⬅️ Back to API Home](../README.md)
