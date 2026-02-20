import { getPgSql } from '../../../database/pg.connection.ts';

export interface PgUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
    created_at?: Date;
    updated_at?: Date;
}

export const save = async (userData: PgUser) => {
    const sql = getPgSql();
    const [user] = await sql`
        INSERT INTO users (name, email, password)
        VALUES (
            ${userData.name as string}, 
            ${userData.email as string}, 
            ${(userData.password ?? '') as string}
        )
        RETURNING id, name, email, created_at, updated_at
    `;
    return user;
};

export const findAll = async () => {
    const sql = getPgSql();
    return sql`SELECT id, name, email, created_at, updated_at FROM users ORDER BY id DESC`;
};

export const findById = async (id: number) => {
    const sql = getPgSql();
    const [user] = await sql`
        SELECT id, name, email, created_at, updated_at 
        FROM users 
        WHERE id = ${id}
    `;
    return user || null;
};

export const update = async (id: number, userData: Partial<PgUser>) => {
    const sql = getPgSql();
    const [user] = await sql`
        UPDATE users 
        SET 
            name = ${userData.name ?? sql`name`},
            email = ${userData.email ?? sql`email`},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING id, name, email, created_at, updated_at
    `;
    return user;
};

export const remove = async (id: number) => {
    const sql = getPgSql();
    await sql`DELETE FROM users WHERE id = ${id}`;
};
