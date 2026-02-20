# SQLite CRUD Example

This example demonstrates how to implement a standard 3-layer CRUD architecture using `bun:sqlite`.

## 📁 Layer Structure
- **Repository**: Native SQLite queries with `RETURNING` clauses.
- **Service**: Business logic and orchestrations.
- **Controller**: Hono request/response handling.

---

### 1. Repository (`user.repository.ts`)
```typescript
import { getSqliteDb } from '../../../database/sqlite.connection.ts';

export const save = async (data: any) => {
    const db = getSqliteDb();
    const result = db.query(`
        INSERT INTO users (name, email, password, created_at, updated_at) 
        VALUES (?, ?, ?, datetime('now'), datetime('now')) 
        RETURNING *
    `).get(data.name, data.email, data.password);
    return result;
};

export const findAll = async () => {
    const db = getSqliteDb();
    return db.query('SELECT * FROM users ORDER BY id DESC').all();
};

export const findById = async (id: number) => {
    const db = getSqliteDb();
    return db.query('SELECT * FROM users WHERE id = ?').get(id);
};

export const remove = async (id: number) => {
    const db = getSqliteDb();
    db.query('DELETE FROM users WHERE id = ?').run(id);
};
```

### 2. Service (`user.service.ts`)
```typescript
import * as UserRepository from '../../../repositories/example/sqlite/user.repository.ts';

export const createUser = async (data: any) => {
    return await UserRepository.save(data);
};
```
