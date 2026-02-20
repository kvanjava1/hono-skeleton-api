import { getRedis } from '../database/redis.connection.ts';
import { configApp } from '../configs/index.ts';
import { logger } from './logger.ts';

export const cacheSet = async (key: string, value: any, ttlSeconds: number = 3600): Promise<void> => {
    if (!configApp.db.redis) return;

    try {
        const redis = getRedis();
        const stringValue = JSON.stringify(value);
        await redis.set(key, stringValue, 'EX', ttlSeconds);
    } catch (error) {
        logger.error(`Cache set failed for key: ${key}`, error);
    }
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
    if (!configApp.db.redis) return null;

    try {
        const redis = getRedis();
        const value = await redis.get(key);
        if (!value) return null;
        return JSON.parse(value) as T;
    } catch (error) {
        logger.error(`Cache get failed for key: ${key}`, error);
        return null;
    }
};

export const cacheDelete = async (key: string): Promise<void> => {
    if (!configApp.db.redis) return;

    try {
        const redis = getRedis();
        await redis.del(key);
    } catch (error) {
        logger.error(`Cache delete failed for key: ${key}`, error);
    }
};

export const cacheDeleteByPattern = async (pattern: string): Promise<void> => {
    if (!configApp.db.redis) return;

    try {
        const redis = getRedis();
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        logger.error(`Cache delete pattern failed: ${pattern}`, error);
    }
};
