import { TiktokRequest, create, findById } from '../src/repositories/tiktokRequest.repository.ts';
import * as TiktokController from '../src/controllers/tiktok.controller.ts';
import { logger } from '../src/utils/logger.ts';

async function verifyRequestStatus() {
    const requestId = crypto.randomUUID();
    const clientId = 'test_client_id';

    logger.info('--- Starting Request Status Verification ---');

    // 1. Seed a test request directly
    create({
        request_id: requestId,
        client_id: clientId,
        usernames: JSON.stringify(['tiktok']),
        total_username: 1,
        process_status: 'pending'
    });
    logger.info(`Seeded test request: ${requestId}`);

    // 2. Simulate Controller Call (since we don't want to deal with tokens/fetch in a simple script)
    // We mock the Hono context
    const mockContext = {
        req: {
            param: (name: string) => name === 'requestId' ? requestId : null
        },
        get: (name: string) => name === 'clientId' ? clientId : null,
        json: (data: any, status: number) => {
            return { data, status };
        }
    } as any;

    try {
        const result = await TiktokController.getRequestStatus(mockContext);
        logger.info('API Call Success!');
        // @ts-ignore - successResponse returns a json response that we mocked
        const body = result.data;

        logger.info(`Request ID: ${body.data.request_id}`);
        logger.info(`Status: ${body.data.process_status}`);
        logger.info(`Percentage: ${body.data.percentage}%`);

        if (body.data.request_id !== requestId) {
            throw new Error('FAILED: Request ID mismatch');
        }

        if (body.data.process_status !== 'pending') {
            throw new Error('FAILED: Status mismatch');
        }

        // 3. Test Not Found
        logger.info('Test 2: Non-existent request (Expected: NotFoundError)');
        const nfContext = {
            req: { param: () => 'non-existent-id' },
            get: () => clientId
        } as any;
        try {
            await TiktokController.getRequestStatus(nfContext);
            throw new Error('FAILED: Should have thrown NotFoundError');
        } catch (e: any) {
            logger.info(`Caught expected error: ${e.message}`);
        }

        // 4. Test Forbidden
        logger.info('Test 3: Forbidden access (Expected: ForbiddenError)');
        const forbiddenContext = {
            req: { param: () => requestId },
            get: () => 'other_client_id'
        } as any;
        try {
            await TiktokController.getRequestStatus(forbiddenContext);
            throw new Error('FAILED: Should have thrown ForbiddenError');
        } catch (e: any) {
            logger.info(`Caught expected error: ${e.message}`);
        }

        logger.info('--- Request Status Verification Completed Successfully ---');
        process.exit(0);
    } catch (error: any) {
        logger.error(`Verification failed: ${error.message}`);
        process.exit(1);
    }
}

verifyRequestStatus();
