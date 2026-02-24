import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import * as ClientRepository from '../repositories/apiClient.repository.ts';
import { configJwt } from '../configs/index.ts';
import { MESSAGES } from '../configs/constants.ts';
import { logger } from '../utils/logger.ts';
import { UnauthorizedError, ForbiddenError, RateLimitError } from '../utils/errors.ts';

export const m2mAuthMiddleware = async (c: Context, next: Next) => {
    // 0. Skip auth for token generation endpoint
    const path = c.req.path;
    logger.info(`[m2mAuth] Incoming path: "${path}"`);

    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1]!;

    // 1. Verify JWT Signature
    const payload = await verify(token, configJwt.secret, 'HS256');
    const clientId = payload.sub as string;

    // 2. Fetch Client for Status & Rate Limit Check
    const client = ClientRepository.findByClientId(clientId);
    if (!client) {
        throw new UnauthorizedError('Client not found');
    }

    if (client.status !== 'active') {
        throw new ForbiddenError('Account is suspended');
    }

    // 3. Rate Limiting Check (SQLite-based)
    const usageCount = ClientRepository.getUsageCount(clientId, 3600000); // 1 hour window
    if (usageCount >= client.rate_limit) {
        logger.warn(`Rate limit exceeded for Client: ${clientId}`);
        throw new RateLimitError(MESSAGES.RATE_LIMIT_EXCEEDED);
    }

    // 4. Attach payload/client to context
    c.set('client', payload);
    c.set('clientId', clientId);

    await next();
};
