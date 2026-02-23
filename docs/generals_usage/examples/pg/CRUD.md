# PostgreSQL CRUD Example

This example demonstrates how to implement a standard 3-layer CRUD architecture using `postgres` (native driver).

## 📁 Layer Structure
- **Repository**: Type-safe queries using the `postgres` driver.
- **Service**: Business logic and orchestrations.
- **Controller**: Hono request/response handling.

---

### 1. Repository (`user.repository.ts`)
```typescript
import { getPgClient } from '../../../database/pg.connection.ts';

export const save = async (data: any) => {
    const sql = getPgClient();
    const [user] = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${data.name}, ${data.email}, ${data.password})
        RETURNING *
    `;
    return user;
};

export const findAll = async () => {
    const sql = getPgClient();
    return await sql`SELECT * FROM users ORDER BY id DESC`;
};

export const findById = async (id: number) => {
    const sql = getPgClient();
    const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
    return user;
};
```
