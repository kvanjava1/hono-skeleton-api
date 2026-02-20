import { createQueue } from '../queues/base.queue.ts';
import type { Job } from 'bullmq';
import { logger } from '../utils/logger.ts';

export const testQueue = createQueue('test-queue');

/**
 * Processor logic for Test
 */
export const testProcessor = async (job: Job) => {
  const { data } = job;
  logger.info(`[BULLMQ] Processing Test job ${job.id}`);
  logger.info(`[BULLMQ] Data received: ${JSON.stringify(data, null, 2)}`);

  // Simulate some work
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true };
};

/**
 * Helper to dispatch this job
 */
export const dispatchTest = async (data: any) => {
  return await testQueue.add('test-task', data);
};
