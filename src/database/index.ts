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
  const { createMysqlPool } = await import('./mysql.connection.ts');
  const { connectMongo } = await import('./mongo.connection.ts');
  const { createPgConnection } = await import('./pg.connection.ts');
  const { createRedisConnection } = await import('./redis.connection.ts');
  const { createSqliteConnection } = await import('./sqlite.connection.ts');

  if (configApp.db.mysql) createMysqlPool();
  if (configApp.db.mongo) await connectMongo();
  if (configApp.db.pg) createPgConnection();
  if (configApp.db.redis) createRedisConnection();
  if (configApp.db.sqlite) createSqliteConnection();
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
