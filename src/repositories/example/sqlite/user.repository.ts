import { getSqliteDb } from '../../../database/sqlite.connection.ts';

/**
 * HELPER: Remove password from user object
 */
const maskPassword = (user: any) => {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
};

export const save = async (data: any) => {
    const db = getSqliteDb();
    const result = db.query(`
        INSERT INTO users (name, email, password, created_at, updated_at) 
        VALUES (?, ?, ?, datetime('now'), datetime('now')) 
        RETURNING *
    `).get(data.name, data.email, data.password);
    return maskPassword(result);
};

export const findAll = async () => {
    const db = getSqliteDb();
    const rows = db.query('SELECT * FROM users ORDER BY id DESC').all();
    return rows.map(maskPassword);
};

export const findById = async (id: number) => {
    const db = getSqliteDb();
    const row = db.query('SELECT * FROM users WHERE id = ?').get(id);
    return maskPassword(row);
};

export const findByEmail = async (email: string) => {
    const db = getSqliteDb();
    return db.query('SELECT * FROM users WHERE email = ?').get(email);
};

export const update = async (id: number, data: any) => {
    const db = getSqliteDb();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.password) { fields.push('password = ?'); values.push(data.password); }

    if (fields.length > 0) {
        fields.push("updated_at = datetime('now')");
        values.push(id);
        db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    return await findById(id);
};

export const remove = async (id: number) => {
    const db = getSqliteDb();
    db.query('DELETE FROM users WHERE id = ?').run(id);
};
