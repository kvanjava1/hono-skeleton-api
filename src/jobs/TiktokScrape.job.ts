import { createQueue } from '../queues/base.queue.ts';
import type { Job } from 'bullmq';
import * as TiktokService from '../services/tiktok.service.ts';
import * as TiktokRequestRepository from '../repositories/tiktokRequest.repository.ts';
import { logger } from '../utils/logger.ts';

/**
 * 1. Create the specific queue instance
 */
export const tiktokScrapeQueue = createQueue('tiktok-scrape');

/**
 * 2. Define the processor logic
 */
export const tiktokScrapeProcessor = async (job: Job) => {
    const { requestId, usernames, callbackUrl } = job.data;
    logger.info(`[TiktokScrapeJob] Processing Job ${job.id} for Request ${requestId}`);

    try {
        // Process profiles in batches (reusing existing TiktokService.getProfilesInfo)
        const results = await TiktokService.getProfilesInfo(usernames, requestId);

        const totalSuccess = results.filter(r => r.status === 'success').length;
        const totalError = results.filter(r => r.status === 'error').length;

        // Update DB
        TiktokRequestRepository.updateProgress(requestId, {
            total_process: results.length,
            total_error: totalError,
            total_success: totalSuccess,
            result: JSON.stringify(results),
            process_status: 'done'
        });

        // Trigger Callback if URL exists
        if (callbackUrl) {
            await triggerCallback(requestId, callbackUrl);
        }

    } catch (error: any) {
        logger.error(`[TiktokScrapeJob] Job ${job.id} failed: ${error.message}`);
        TiktokRequestRepository.updateProgress(requestId, {
            total_process: 0,
            total_error: usernames.length,
            total_success: 0,
            result: JSON.stringify([{ status: 'error', message: error.message }]),
            process_status: 'done'
        });
        throw error;
    }
};

/**
 * 3. Export a type-safe dispatcher helper
 */
export const dispatchTiktokScrape = async (data: { requestId: string; usernames: string[]; callbackUrl?: string }) => {
    return await tiktokScrapeQueue.add('scrape-task', data, { jobId: data.requestId });
};

/**
 * Webhook Callback Logic (Internal Helper)
 */
const triggerCallback = async (requestId: string, url: string, retryCount = 0) => {
    const requestData = TiktokRequestRepository.findById(requestId);
    if (!requestData) return;

    logger.info(`[TiktokScrapeJob] Triggering callback for ${requestId} to ${url} (Attempt ${retryCount + 1}/3)`);

    try {
        const percentage = requestData.total_username > 0
            ? Math.round((requestData.total_process / requestData.total_username) * 100)
            : 0;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'success',
                message: 'TikTok Profiles processed',
                data: {
                    request_id: requestData.request_id,
                    total_username: requestData.total_username,
                    total_process: requestData.total_process,
                    total_error: requestData.total_error,
                    total_success: requestData.total_success,
                    process_percentage: percentage,
                    process_status: requestData.process_status,
                    created_at: requestData.created_at,
                    result: JSON.parse(requestData.result || '[]')
                }
            })
        });

        const responseText = await response.text();
        TiktokRequestRepository.updateCallback(requestId, {
            callback_response: JSON.stringify({ status: response.status, body: responseText }),
            callback_retry_count: retryCount
        });

        if (!response.ok && retryCount < 2) {
            // Wait 5 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 5000));
            await triggerCallback(requestId, url, retryCount + 1);
        }
    } catch (error: any) {
        logger.error(`[TiktokScrapeJob] Callback failed for ${requestId}: ${error.message}`);
        TiktokRequestRepository.updateCallback(requestId, {
            callback_response: JSON.stringify({ error: error.message }),
            callback_retry_count: retryCount
        });

        if (retryCount < 2) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            await triggerCallback(requestId, url, retryCount + 1);
        }
    }
};
