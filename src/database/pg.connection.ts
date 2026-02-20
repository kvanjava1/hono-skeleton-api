import postgres from 'postgres';
import { configPg, configApp } from '../configs/index.ts';
import { logger } from '../utils/logger.ts';

let sql: postgres.Sql | null = null;

export const createPgConnection = () => {
    if (!configApp.db.pg) {
        throw new Error('PostgreSQL is disabled in configuration. Enable DB_PG_ENABLED=true in your .env file.');
    }
    if (sql) return sql;

    try {
        sql = postgres({
            host: configPg.host,
            port: configPg.port,
            user: configPg.user,
            password: configPg.password,
            database: configPg.database,
        });

        logger.info(`PostgreSQL connected to ${configPg.database}`);
        return sql;
    } catch (error) {
        logger.error('PostgreSQL connection failed', error);
        throw error;
    }
};

export const getPgSql = () => {
    if (!sql) {
        return createPgConnection();
    }
    return sql;
};

export const closePgConnection = async () => {
    if (sql) {
        await sql.end();
        sql = null;
        logger.info('PostgreSQL connection closed');
    }
};

export const testPgConnection = async () => {
    try {
        const pgSql = getPgSql();
        await pgSql`SELECT 1`;
        logger.info('PostgreSQL connection test successful');
        return true;
    } catch (error) {
        logger.error('PostgreSQL connection test failed', error);
        return false;
    }
};
