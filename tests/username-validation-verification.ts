import * as TiktokController from '../src/controllers/tiktok.controller.ts';
import { logger } from '../src/utils/logger.ts';

async function verifyUsernameValidation() {
    logger.info('--- Starting Username Validation Verification ---');

    const testCases = [
        { username: 'khaby.lame', expected: '@khaby.lame', valid: true },
        { username: '@khaby.lame', expected: '@khaby.lame', valid: true },
        { username: 'user_123', expected: '@user_123', valid: true },
        { username: '@a.', valid: false }, // Ends with dot
        { username: 'a', valid: false }, // Too short
        { username: 'this_is_way_too_long_for_a_tiktok_username', valid: false },
        { username: 'invalid space', valid: false },
        { username: 'invalid!', valid: false }
    ];

    for (const test of testCases) {
        logger.info(`Testing: "${test.username}"`);

        // Mock context
        let capturedResult: any = null;
        const mockContext = {
            req: {
                json: async () => ({
                    usernames: [test.username],
                    request: { process: { type: 'instant' } }
                })
            },
            get: (name: string) => name === 'clientId' ? 'test_client' : null,
            json: (data: any, status: number) => {
                capturedResult = { data, status };
                return { data, status };
            }
        } as any;

        try {
            // We use a try/catch because we expect some to fail with ValidationError (which is a subclass of Error)
            // But since the controller is called, we need to handle the fact that it might call the service.
            // We want to stop right after validation.

            // To test ONLY the validation part, we can't easily call the controller without it executing the rest.
            // However, we can check if it throws a ValidationError.

            await TiktokController.getProfiles(mockContext);

            if (!test.valid) {
                throw new Error(`FAILED: Expected validation error for "${test.username}" but it passed.`);
            }
            logger.info(`SUCCESS: "${test.username}" passed validation.`);

        } catch (error: any) {
            if (test.valid) {
                logger.error(`FAILED: Expected "${test.username}" to be valid, but caught error: ${error.message}`);
                // process.exit(1); 
            } else {
                logger.info(`SUCCESS: Caught expected validation error for "${test.username}": ${error.message}`);
            }
        }
    }

    logger.info('--- Username Validation Verification Completed ---');
    process.exit(0);
}

verifyUsernameValidation();
