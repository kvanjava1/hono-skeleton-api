import type { Hono } from 'hono';
import * as QueueController from '../../controllers/example/Queue.controller.ts';

export const registerQueueRoutes = (app: Hono) => {
    app.post('/api/queue/scrape', QueueController.startScraping);
};
