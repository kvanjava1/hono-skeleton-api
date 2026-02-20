import { createQueue } from '../queues/base.queue.ts';
import type { Job } from 'bullmq';
import { logger } from '../utils/logger.ts';

export const scrapeQueue = createQueue('scrape-queue');

/**
 * Processor logic for Scrape
 */
export const scrapeProcessor = async (job: Job) => {
  const { url } = job.data;
  logger.info(`[SCRAPER] Starting to scrape: ${url}`);

  // Simulate heavy scraping work
  await new Promise(resolve => setTimeout(resolve, 3000));

  logger.info(`[SCRAPER] Finished scraping: ${url}`);
  return { success: true, url, pages: 10 };
};

/**
 * Helper to dispatch this job
 */
export const dispatchScrape = async (data: any) => {
  return await scrapeQueue.add('scrape-task', data);
};

