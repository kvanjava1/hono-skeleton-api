export {
  createMysqlPool,
  getMysqlPool,
  closeMysqlPool,
  testMysqlConnection,
  type MysqlPool,
  type MysqlConnection,
} from './mysql.connection.ts';

export {
  connectMongo,
  disconnectMongo,
  testMongoConnection,
  getMongoDb,
} from './mongo.connection.ts';

export {
  createPgConnection,
  getPgSql,
  closePgConnection,
  testPgConnection,
} from './pg.connection.ts';

export {
  createRedisConnection,
  getRedis,
  closeRedisConnection,
  testRedisConnection,
} from './redis.connection.ts';

export {
  createSqliteConnection,
  getSqliteDb,
  closeSqliteConnection,
  testSqliteConnection,
} from './sqlite.connection.ts';

import { configApp } from '../configs/index.ts';

export const connectAllDatabases = async (): Promise<void> => {
  const { createMysqlPool, testMysqlConnection } = await import('./mysql.connection.ts');
  const { connectMongo } = await import('./mongo.connection.ts');
  const { createPgConnection, testPgConnection } = await import('./pg.connection.ts');
  const { createRedisConnection, testRedisConnection } = await import('./redis.connection.ts');
  const { createSqliteConnection, testSqliteConnection } = await import('./sqlite.connection.ts');

  if (configApp.db.mysql) {
    createMysqlPool();
    const isOk = await testMysqlConnection();
    if (!isOk) throw new Error('MySQL connection failed during startup');
  }

  if (configApp.db.mongo) {
    await connectMongo();
  }

  if (configApp.db.pg) {
    createPgConnection();
    const isOk = await testPgConnection();
    if (!isOk) throw new Error('PostgreSQL connection failed during startup');
  }

  if (configApp.db.redis) {
    createRedisConnection();
    const isOk = await testRedisConnection();
    if (!isOk) throw new Error('Redis connection failed during startup');
  }

  if (configApp.db.sqlite) {
    createSqliteConnection();
    const isOk = testSqliteConnection();
    if (!isOk) throw new Error('SQLite connection failed during startup');
  }
};

export const disconnectAllDatabases = async (): Promise<void> => {
  const { closeMysqlPool } = await import('./mysql.connection.ts');
  const { disconnectMongo } = await import('./mongo.connection.ts');
  const { closePgConnection } = await import('./pg.connection.ts');
  const { closeRedisConnection } = await import('./redis.connection.ts');
  const { closeSqliteConnection } = await import('./sqlite.connection.ts');

  if (configApp.db.mysql) await closeMysqlPool();
  if (configApp.db.mongo) await disconnectMongo();
  if (configApp.db.pg) await closePgConnection();
  if (configApp.db.redis) await closeRedisConnection();
  if (configApp.db.sqlite) closeSqliteConnection();
};
