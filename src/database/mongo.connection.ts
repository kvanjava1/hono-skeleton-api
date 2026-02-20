import { MongoClient, Db } from 'mongodb';
import { configMongo, configApp } from '../configs/index.ts';
import { logger } from '../utils/logger.ts';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectMongo = async (): Promise<Db> => {
  if (!configApp.db.mongo) {
    throw new Error('MongoDB is disabled in configuration. Enable DB_MONGO_ENABLED=true in your .env file.');
  }
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(configMongo.getUri(), {
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    db = client.db(configMongo.dbName);

    logger.info(`MongoDB connected to ${configMongo.dbName}`);
    return db;
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
};

export const disconnectMongo = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    logger.info('MongoDB disconnected');
  }
};

export const testMongoConnection = async (): Promise<boolean> => {
  try {
    const database = await connectMongo();
    await database.command({ ping: 1 });
    logger.info('MongoDB connection test successful');
    return true;
  } catch (error) {
    logger.error('MongoDB connection test failed', error);
    return false;
  }
};

export const getMongoDb = (): Db => {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongo() first.');
  }
  return db;
};
