# MySQL CRUD Example

This example demonstrates how to implement a standard 3-layer CRUD architecture using MySQL.

## 📁 Layer Structure
- **Repository**: Raw SQL queries using `mysql2`.
- **Service**: Business logic and orchestrations.
- **Controller**: Hono request/response handling.

---

### 1. Repository (`user.repository.ts`)
```typescript
import { getMysqlPool } from '../../../database/mysql.connection.ts';

export const save = async (data: any) => {
    const pool = getMysqlPool();
    const [result] = await pool.execute<any>(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [data.name, data.email, data.password]
    );
    return await findById(result.insertId);
};

export const findAll = async () => {
    const pool = getMysqlPool();
    const [rows] = await pool.execute<any[]>('SELECT * FROM users ORDER BY id DESC');
    return rows;
};

export const findById = async (id: number) => {
    const pool = getMysqlPool();
    const [rows] = await pool.execute<any[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

export const update = async (id: number, data: any) => {
    const pool = getMysqlPool();
    // ... dynamic update logic ...
    await pool.execute(`UPDATE users SET name = ? WHERE id = ?`, [data.name, id]);
    return await findById(id);
};

export const remove = async (id: number) => {
    const pool = getMysqlPool();
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
};
```

### 2. Service (`user.service.ts`)
```typescript
import * as UserRepository from '../../../repositories/example/mysql/user.repository.ts';

export const createUser = async (data: any) => {
    return await UserRepository.save(data);
};

export const getUsers = async () => {
    return await UserRepository.findAll();
};
```

### 3. Controller (`user.controller.ts`)
```typescript
import { successResponse } from '../../utils/response.ts';

export const getMysqlUsers = async (c: Context) => {
    const users = await MySQLService.getUsers();
    return successResponse(c, "Users fetched", users);
};
```
