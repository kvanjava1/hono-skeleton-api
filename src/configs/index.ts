const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const getEnvNumber = (key: string, defaultValue?: number): number => {
  const stringValue = process.env[key]?.trim();
  if (stringValue === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is required`);
    }
    return defaultValue;
  }
  const value = parseInt(stringValue, 10);
  if (isNaN(value)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return value;
};

const getEnvBool = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key]?.trim().toLowerCase();
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
};

export const configApp = {
  port: getEnvNumber('PORT', 8080),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  db: {
    mongo: getEnvBool('DB_MONGO_ENABLED', false),
    mysql: getEnvBool('DB_MYSQL_ENABLED', false),
    pg: getEnvBool('DB_PG_ENABLED', false),
    sqlite: getEnvBool('DB_SQLITE_ENABLED', false),
    redis: getEnvBool('DB_REDIS_ENABLED', false),
  }
};

export const configRedis = {
  host: getEnv('REDIS_HOST', 'localhost'),
  port: getEnvNumber('REDIS_PORT', 6379),
};

export const configQueue = {
  concurrency: getEnvNumber('QUEUE_CONCURRENCY', 5),
  removeOnComplete: getEnvBool('QUEUE_REMOVE_ON_COMPLETE', true),
  removeOnFail: getEnvNumber('QUEUE_REMOVE_ON_FAIL', 100), // Keep last 100 failed jobs
};

export const configMongo = {
  host: getEnv('MONGO_HOST', 'localhost'),
  port: getEnvNumber('MONGO_PORT', 27017),
  dbName: getEnv('MONGO_DB_NAME', 'myapp'),
  getUri() {
    return `mongodb://${this.host}:${this.port}/${this.dbName}`;
  },
};

export const configMysql = {
  host: getEnv('MYSQL_HOST', 'localhost'),
  port: getEnvNumber('MYSQL_PORT', 3306),
  user: getEnv('MYSQL_USER', 'root'),
  password: getEnv('MYSQL_PASSWORD', ''),
  database: getEnv('MYSQL_DATABASE', 'myapp'),
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
};

export const configSqlite = {
  dbPath: getEnv('SQLITE_DB_PATH', './storages/database/sqlite/dev.db'),
};

export const configRateLimiter = {
  windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
  max: getEnvNumber('RATE_LIMIT_MAX', 100),
};

export const configCors = {
  origin: getEnv('CORS_ORIGIN', '*'),
};

export const configJwt = {
  secret: getEnv('JWT_SECRET', 'your-super-secret-key'),
  expiresIn: getEnv('JWT_EXPIRES_IN', '1h'),
};

export const configPg = {
  host: getEnv('PG_HOST', 'localhost'),
  port: getEnvNumber('PG_PORT', 5432),
  user: getEnv('PG_USER', 'postgres'),
  password: getEnv('PG_PASSWORD', ''),
  database: getEnv('PG_DATABASE', 'myapp'),
};

export type ConfigApp = typeof configApp;
export type ConfigMongo = typeof configMongo;
export type ConfigMysql = typeof configMysql;
export type ConfigPg = typeof configPg;
export type ConfigRedis = typeof configRedis;
export type ConfigSqlite = typeof configSqlite;
export type ConfigRateLimiter = typeof configRateLimiter;
export type ConfigCors = typeof configCors;
export type ConfigQueue = typeof configQueue;
export type ConfigJwt = typeof configJwt;
