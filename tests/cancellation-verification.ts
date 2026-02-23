import * as TiktokController from '../src/controllers/tiktok.controller.ts';
import * as TiktokRequestRepository from '../src/repositories/tiktokRequest.repository.ts';
import { logger } from '../src/utils/logger.ts';

async function verifyCancellation() {
    logger.info('--- Starting Request Cancellation Verification ---');

    const clientId = 'test_client_cancellation';
    const usernames = Array.from({ length: 30 }, (_, i) => `user_${i + 1}`); // 3 batches

    // 1. Start a callback job
    logger.info('Starting a 30-user callback job...');
    const startContext = {
        req: {
            json: async () => ({
                usernames,
                request: {
                    process: {
                        type: 'callback',
                        callback: { url: 'http://localhost:9999/webhook' }
                    }
                }
            })
        },
        get: () => clientId,
        json: (data: any) => data
    } as any;

    const startResponse = await TiktokController.getProfiles(startContext);
    const requestId = startResponse.data.request_id;
    logger.info(`Job started with Request ID: ${requestId}`);

    // 2. Cancel the job
    logger.info('Cancelling the job immediately...');
    const cancelContext = {
        req: { param: () => requestId },
        get: () => clientId,
        json: (data: any) => data
    } as any;

    const cancelResponse = await TiktokController.cancelRequest(cancelContext);
    logger.info(`Cancel API Message: ${cancelResponse.message}`);

    // 3. Wait and check status
    logger.info('Waiting 5 seconds for worker batches to process...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const finalRequest = TiktokRequestRepository.findById(requestId);
    logger.info(`Final Process Status: ${finalRequest?.process_status}`);
    logger.info(`Total Processed: ${finalRequest?.total_process}`);

    if (finalRequest?.process_status === 'cancelled' && finalRequest.total_process < 30) {
        logger.info('--- Request Cancellation Verification Completed Successfully ---');
        process.exit(0);
    } else {
        logger.error(`FAILED: Request status is ${finalRequest?.process_status} and processed ${finalRequest?.total_process}/30`);
        process.exit(1);
    }
}

verifyCancellation();
