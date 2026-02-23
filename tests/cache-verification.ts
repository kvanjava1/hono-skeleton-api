import { getProfilesInfo } from '../src/services/tiktok.service.ts';
import { cacheDelete } from '../src/utils/cache.ts';
import { logger } from '../src/utils/logger.ts';

async function verifyCaching() {
    const testUsername = 'mockuser';
    const cacheKey = `tt:profile:${testUsername}`;
    const mockData = {
        user: { username: 'mockuser', nickname: 'Mock User' },
        stats: { followerCount: 1000 }
    };

    logger.info('--- Starting Cache Verification (Manual Injection) ---');

    // 1. Clear cache
    await cacheDelete(cacheKey);
    logger.info(`Cleared cache for ${testUsername}`);

    // 2. Manually inject into Redis
    // Importing cacheSet from the same place TiktokService does
    const { cacheSet, cacheGet } = await import('../src/utils/cache.ts');
    await cacheSet(cacheKey, mockData, 3600);
    logger.info(`Manually injected mock data for ${testUsername}`);

    // 3. Call getProfilesInfo: Should be a CACHE HIT
    logger.info(`Test 1: Call getProfilesInfo for ${testUsername} (Expected: Cache Hit)`);
    const result = await getProfilesInfo([testUsername]);

    logger.info(`Result status: ${result[0].status}`);
    logger.info(`Result from cache: ${result[0]._from_cache || false}`);
    logger.info(`Result data nickname: ${result[0].data?.user?.nickname}`);

    if (!result[0]._from_cache) {
        throw new Error('FAILED: Should have retrieved data from cache');
    }

    if (result[0].data?.user?.nickname !== 'Mock User') {
        throw new Error('FAILED: Data mismatch in cached result');
    }

    // 4. Batch Test with Mixed data
    logger.info('Test 2: Batch call with mixed cache (Expected: 1 Hit, 2 Misses)');
    const usernames = [testUsername, 'nonexistent1', 'nonexistent2'];
    const resultBatch = await getProfilesInfo(usernames);

    usernames.forEach((u, i) => {
        logger.info(`Profile ${u}: status=${resultBatch[i].status}, cached=${resultBatch[i]._from_cache || false}`);
    });

    if (!resultBatch[0]._from_cache || resultBatch[1]._from_cache || resultBatch[2]._from_cache) {
        throw new Error('FAILED: Batch cache hits/misses are incorrect');
    }

    logger.info('--- Cache Verification Completed Successfully ---');
}

verifyCaching().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
