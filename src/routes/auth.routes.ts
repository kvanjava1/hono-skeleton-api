import type { Hono } from 'hono';
import * as AuthController from '../controllers/auth.controller.ts';
import { m2mAuthMiddleware } from '../middlewares/m2mAuth.middleware.ts';
import { m2mLoggerMiddleware } from '../middlewares/m2mLogger.middleware.ts';

export const registerAuthRoutes = (app: Hono) => {
    app.use('/m2m/*', m2mLoggerMiddleware);
    app.post('/m2m/token', AuthController.getToken);
    app.get('/m2m/me', m2mAuthMiddleware, AuthController.getMe);
};
