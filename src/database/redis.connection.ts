import Redis from 'ioredis';
import { configRedis, configApp } from '../configs/index.ts';
import { logger } from '../utils/logger.ts';

let redis: Redis | null = null;

export const createRedisConnection = (): Redis => {
    if (!configApp.db.redis) {
        throw new Error('Redis is disabled in configuration. Enable DB_REDIS_ENABLED=true in your .env file.');
    }

    if (redis) return redis;

    try {
        redis = new Redis({
            host: configRedis.host,
            port: configRedis.port,
            maxRetriesPerRequest: 1,
            retryStrategy: (times) => {
                if (times > 1) {
                    logger.error(`Redis reconnection failed after ${times - 1} attempts. Stopping.`);
                    return null;
                }
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });

        redis.on('connect', () => {
            logger.info(`Redis connected to ${configRedis.host}:${configRedis.port}`);
        });

        redis.on('error', (error) => {
            logger.error('Redis connection error', error);
        });

        return redis;
    } catch (error) {
        logger.error('Redis connection failed', error);
        throw error;
    }
};

export const getRedis = (): Redis => {
    if (!redis) {
        return createRedisConnection();
    }
    return redis;
};

export const closeRedisConnection = async (): Promise<void> => {
    if (redis) {
        await redis.quit();
        redis = null;
        logger.info('Redis connection closed');
    }
};

export const testRedisConnection = async (): Promise<boolean> => {
    try {
        const client = getRedis();
        const result = await client.ping();
        const isOk = result === 'PONG';
        if (isOk) logger.info('Redis connection test successful');
        return isOk;
    } catch (error) {
        logger.error('Redis connection test failed', error);
        return false;
    }
};
