import type { Context, Next } from 'hono';
import { HTTP_STATUS, MESSAGES } from '../configs/constants.ts';
import { errorResponse } from '../utils/response.ts';
import { logger } from '../utils/logger.ts';
import { configApp } from '../configs/index.ts';
import { AppError, ConflictError, ValidationError } from '../utils/errors.ts';

/**
 * Transforms external/driver errors into Unified AppErrors
 */
const transformError = (err: any): Error => {
  // MySQL/Postgres Duplicate Entry
  if (err.message?.includes('Duplicate entry') || err.code === '23505') {
    return new ConflictError('The data you provided already exists (Duplicate Entry).');
  }

  // MongoDB Duplicate Key
  if (err.code === 11000) {
    return new ConflictError('A record with this unique value already exists in MongoDB.');
  }

  // Hono/Zod Validation Name check
  if (err.name === 'ValidationError') {
    return new ValidationError(err.message);
  }

  return err;
};

/**
 * Main Error Formatter
 */
export const errorHandler = async (err: Error, c: Context): Promise<Response> => {
  // 1. Transform the error if needed
  const error = transformError(err);

  // 2. Log full details internally
  logger.error(error.message, {
    name: error.name,
    stack: error.stack,
    path: c.req.path
  });

  // 3. Handle Unified AppErrors (Operational)
  if (error instanceof AppError) {
    return errorResponse(c, error.message, error.statusCode);
  }

  // 4. Handle System/Unknown Errors (The Mask)
  const message = configApp.isProduction ? MESSAGES.INTERNAL_ERROR : error.message;
  const data = configApp.isProduction ? null : { stack: error.stack };

  return errorResponse(c, message, HTTP_STATUS.INTERNAL_SERVER_ERROR, data);
};

/**
 * Middleware Wrapper
 */
export const errorMiddleware = async (c: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    await errorHandler(error, c);
  }
};
