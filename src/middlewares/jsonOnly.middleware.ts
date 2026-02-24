import type { Context, Next } from 'hono';
import { ValidationError } from '../utils/errors.ts';

/**
 * Middleware to enforce application/json Content-Type for requests with bodies.
 */
export const jsonOnlyMiddleware = async (c: Context, next: Next) => {
    const method = c.req.method;
    const contentType = c.req.header('Content-Type');

    // Only check methods that typically have a body
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        if (!contentType || !contentType.includes('application/json')) {
            throw new ValidationError('Only application/json is accepted for this request.');
        }
    }

    await next();
};
