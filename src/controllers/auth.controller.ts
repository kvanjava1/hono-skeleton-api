import type { Context } from 'hono';
import * as AuthService from '../services/auth.service.ts';
import { successResponse } from '../utils/response.ts';
import { configJwt } from '../configs/index.ts';
import { ValidationError } from '../utils/errors.ts';

export const getToken = async (c: Context) => {
    const body = await c.req.json();
    const { clientId, clientSecret } = body;
    const currentIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

    if (!clientId || !clientSecret) {
        throw new ValidationError('clientId and clientSecret are required');
    }

    const client = await AuthService.validateClientByCredentials(clientId, clientSecret, currentIp);
    const token = await AuthService.generateAccessToken(client);

    return successResponse(c, 'Token generated successfully', {
        accessToken: token,
        tokenType: 'Bearer',
        expiresIn: AuthService.parseDuration(configJwt.expiresIn)
    });
};

export const getMe = async (c: Context) => {
    const client = c.get('client');
    return successResponse(c, 'Client details retrieved successfully', {
        clientId: client.sub,
        name: client.name,
        status: 'authorized'
    });
};
