import type { Context, Next } from 'hono';
import * as ClientRepository from '../repositories/apiClient.repository.ts';
import { logger } from '../utils/logger.ts';

export const m2mLoggerMiddleware = async (c: Context, next: Next) => {
    // 1. PRE-CAPTURE: Request Body
    let requestBody = null;
    if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
        try {
            requestBody = await c.req.raw.clone().text();
        } catch (e) {
            // Silently fail
        }
    }

    await next();

    // 2. POST-CAPTURE: Response Body
    let responseBody = null;
    const contentLength = parseInt(c.res.headers.get('content-length') || '0');

    // Only capture response body if it's reasonably small (e.g., < 100KB)
    if (contentLength < 102400) {
        try {
            const res = c.res.clone();
            responseBody = await res.text();
        } catch (e) {
            // Silently fail
        }
    } else {
        responseBody = '[Response body too large to log]';
    }

    // 3. LOGGING
    const clientId = c.get('clientId') || 'anonymous';
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

    const activityData = {
        client_id: clientId,
        ip_address: ip,
        endpoint: c.req.path,
        method: c.req.method,
        status_code: c.res.status,
        request_body: requestBody,
        response_body: responseBody
    };

    // Database Log
    // Note: We only log if it's M2M related (clientId set or path starts with /api/m2m)
    if (clientId !== 'anonymous' || c.req.path.startsWith('/api/m2m')) {
        ClientRepository.logUsage(activityData);
        logger.info(`[M2M-ACTIVITY] Client: ${clientId} - ${activityData.method} ${activityData.endpoint} - ${activityData.status_code}`);
    }
};
