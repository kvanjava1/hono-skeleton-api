import { getMysqlPool } from '../../../database/mysql.connection.ts';

/**
 * HELPER: Remove password from user object
 */
const maskPassword = (user: any) => {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
};

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
    return rows.map(maskPassword);
};

export const findById = async (id: number) => {
    const pool = getMysqlPool();
    const [rows] = await pool.execute<any[]>('SELECT * FROM users WHERE id = ?', [id]);
    return maskPassword(rows[0]);
};

export const findByEmail = async (email: string) => {
    const pool = getMysqlPool();
    const [rows] = await pool.execute<any[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
};

export const update = async (id: number, data: any) => {
    const pool = getMysqlPool();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.password) { fields.push('password = ?'); values.push(data.password); }

    if (fields.length > 0) {
        values.push(id);
        await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return await findById(id);
};

export const remove = async (id: number) => {
    const pool = getMysqlPool();
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
};
