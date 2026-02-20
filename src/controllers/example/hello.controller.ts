import type { Context } from 'hono';
import { successResponse } from '../../utils/response.ts';
import { MESSAGES } from '../../configs/constants.ts';

export const getHello = (c: Context) => {
    return successResponse(c, MESSAGES.HELLO_WORLD, { message: "Hello World" });
};

export const getHealth = (c: Context) => {
    return successResponse(c, MESSAGES.HEALTH_OK, { status: "OK", timestamp: new Date() });
};
