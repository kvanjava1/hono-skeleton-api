import type { Hono } from 'hono';
import * as TiktokController from '../controllers/tiktok.controller.ts';

export const registerTiktokRoutes = (app: Hono) => {
    // Routes are now protected globally in src/routes/index.ts
    app.post('/tiktok/profiles', TiktokController.getProfiles);
    app.get('/tiktok/profiles/:requestId/request', TiktokController.getRequestStatus);
    app.post('/tiktok/profiles/:requestId/request/cancel', TiktokController.cancelRequest);
};
