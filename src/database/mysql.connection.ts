import mysql from 'mysql2/promise';
import { configMysql, configApp } from '../configs/index.ts';
import { logger } from '../utils/logger.ts';

let pool: mysql.Pool | null = null;

export const createMysqlPool = (): mysql.Pool => {
  if (!configApp.db.mysql) {
    throw new Error('MySQL is disabled in configuration. Enable DB_MYSQL_ENABLED=true in your .env file.');
  }
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: configMysql.host,
    port: configMysql.port,
    user: configMysql.user,
    password: configMysql.password,
    database: configMysql.database,
    connectionLimit: configMysql.connectionLimit,
    waitForConnections: configMysql.waitForConnections,
    queueLimit: configMysql.queueLimit,
  });

  logger.info('MySQL connection pool created');
  return pool;
};

export const getMysqlPool = (): mysql.Pool => {
  if (!pool) {
    return createMysqlPool();
  }
  return pool;
};

export const closeMysqlPool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('MySQL connection pool closed');
  }
};

export const testMysqlConnection = async (): Promise<boolean> => {
  try {
    const connection = await getMysqlPool().getConnection();
    await connection.ping();
    connection.release();
    logger.info('MySQL connection test successful');
    return true;
  } catch (error) {
    logger.error('MySQL connection test failed', error);
    return false;
  }
};

export type MysqlPool = mysql.Pool;
export type MysqlConnection = mysql.PoolConnection;
