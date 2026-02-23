import { createWorker } from '../queues/base.queue.ts';
import { tiktokScrapeProcessor } from '../jobs/TiktokScrape.job.ts';
import { logger } from '../utils/logger.ts';

/**
 * Initialize all Workers
 */
const startWorkers = () => {
    logger.info('Background Workers starting...');
    createWorker('tiktok-scrape', tiktokScrapeProcessor);
    logger.info('Workers are ready and listening for jobs.');
};

const shutdown = async () => {
    logger.info('Shutting down workers...');
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// "import.meta.main" is true ONLY when this file is run directly (bun run src/workers/index.ts)
// It is false when this file is imported by src/index.ts
if (import.meta.main) {
    startWorkers();
}

export { startWorkers };
