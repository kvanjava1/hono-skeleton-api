import { Database } from 'bun:sqlite';
import { configSqlite, configApp } from '../configs/index.ts';
import { logger } from '../utils/logger.ts';
import * as fs from 'fs';
import * as path from 'path';

let db: Database | null = null;

const ensureDirectoryExists = (filePath: string): void => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const createSqliteConnection = (): Database => {
  if (!configApp.db.sqlite) {
    throw new Error('SQLite is disabled in configuration. Enable DB_SQLITE_ENABLED=true in your .env file.');
  }
  if (db) {
    return db;
  }

  ensureDirectoryExists(configSqlite.dbPath);
  db = new Database(configSqlite.dbPath);
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA busy_timeout = 10000'); // Wait up to 10 seconds if the DB is locked

  logger.info(`SQLite connected to ${configSqlite.dbPath}`);
  return db;
};

export const getSqliteDb = (): Database => {
  if (!db) {
    return createSqliteConnection();
  }
  return db;
};

export const closeSqliteConnection = (): void => {
  if (db) {
    db.close();
    db = null;
    logger.info('SQLite connection closed');
  }
};

export const testSqliteConnection = (): boolean => {
  try {
    const database = getSqliteDb();
    database.query('SELECT 1').get();
    logger.info('SQLite connection test successful');
    return true;
  } catch (error) {
    logger.error('SQLite connection test failed', error);
    return false;
  }
};
