import { Queue, Worker, type Job, type Processor } from 'bullmq';
import { configRedis, configQueue } from '../configs/index.ts';
import { logger } from '../utils/logger.ts';

const connection = {
    host: configRedis.host,
    port: configRedis.port,
};

/**
 * Base Queue Factory
 */
export const createQueue = (name: string) => {
    return new Queue(name, {
        connection,
        defaultJobOptions: {
            removeOnComplete: configQueue.removeOnComplete,
            removeOnFail: configQueue.removeOnFail,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        },
    });
};

/**
 * Base Worker Factory
 */
export const createWorker = (name: string, processor: Processor) => {
    const worker = new Worker(name, processor, {
        connection,
        concurrency: configQueue.concurrency,
    });

    worker.on('completed', (job: Job) => {
        logger.info(`Job ${job.id} [${name}] has completed!`);
    });

    worker.on('failed', (job: Job | undefined, err: Error) => {
        logger.error(`Job ${job?.id} [${name}] has failed with ${err.message}`);
    });

    return worker;
};
