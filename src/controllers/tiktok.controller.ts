import type { Context } from 'hono';
import * as TiktokService from '../services/tiktok.service.ts';
import { successResponse } from '../utils/response.ts';
import { logger } from '../utils/logger.ts';

export const getProfiles = async (c: Context) => {
    const body = await c.req.json();
    const { usernames, request } = body;
    const clientId = c.get('clientId') as string;

    const result = await TiktokService.initializeProfilesRequest(usernames, request?.process, clientId);

    const message = request?.process?.type === 'callback'
        ? 'TikTok Profiles processing queued'
        : 'TikTok Profiles processed';

    return successResponse(c, message, result);
};

export const getRequestStatus = async (c: Context) => {
    const requestId = c.req.param('requestId');
    const clientId = c.get('clientId') as string;

    const result = await TiktokService.getRequestStatus(requestId, clientId);

    return successResponse(c, 'TikTok Request status retrieved', result);
};

export const cancelRequest = async (c: Context) => {
    const requestId = c.req.param('requestId');
    const clientId = c.get('clientId') as string;

    // delegate all logic (checks + processing) to service
    await TiktokService.cancelRequest(requestId, clientId);

    return successResponse(c, 'TikTok Request cancellation processed');
};
