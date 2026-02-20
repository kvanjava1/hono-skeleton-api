import { createWorker } from '../queues/base.queue.ts';
import { logger } from '../utils/logger.ts';

// 1. Import all job processors here
import { testProcessor } from '../jobs/Test.job.ts';
// import { emailProcessor } from '../jobs/EmailJob.ts';
import { scrapeProcessor } from '../jobs/Scrape.job.ts';

/**
 * Initialize all Workers
 */
const startWorkers = () => {
    logger.info('Background Workers starting...');

    // 2. Register workers here
    // The first argument must match the name in createQueue('...')
    createWorker('test-queue', testProcessor);
    // createWorker('default', emailProcessor);
    createWorker('scrape-queue', scrapeProcessor);

    logger.info('Workers are ready and listening for jobs.');
};

// Handle Graceful Shutdown
const shutdown = async () => {
    logger.info('Shutting down workers...');
    // In a real scenario, we would close each worker instance here
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startWorkers();
