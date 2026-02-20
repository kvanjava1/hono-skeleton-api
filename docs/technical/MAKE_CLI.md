# Make CLI Guide (Laravel-style)

## Overview

The `make` CLI allows you to quickly generate files for your project using pre-defined templates. This ensures consistency and saves time.

## Available Commands

| Type | Command |
| :--- | :--- |
| **Controller** | `bun run make controller <name>` |
| **Service** | `bun run make service <target> <name>` |
| **Repository** | `bun run make repository <target> <name>` |
| **Schema** | `bun run make schema <name>` |

**Targets:** `mysql`, `mongo`, `pg`, `sqlite`

---

## Usage Examples

### 1. Generating a Service
Generates a new business logic file in `src/services/<target>/`.
```bash
# Generates user.service.ts for PostgreSQL
bun run make service pg User
```

### 2. Generating a Controller
Generates a new handler file in `src/controllers/`.
```bash
# Generates post.controller.ts
bun run make controller Post
```

### 3. Generating a Repository
Generates a new raw query file in `src/repositories/<target>/`.
```bash
# Generates user.repository.ts for PostgreSQL
bun run make repository pg User
```

### 4. Generating a Schema
Generates a new Zod/TypeScript schema file in `src/schemas/`.
```bash
# Generates profile.schema.ts
bun run make schema Profile
```

---

## Why use this?
*   **Speed**: No more copy-pasting files.
*   **Consistency**: Every controller and repository follows the same boilerplate.
*   **Organization**: Files are automatically placed in the correct `mysql`, `mongo`, `pg`, or `sqlite` subfolders.
