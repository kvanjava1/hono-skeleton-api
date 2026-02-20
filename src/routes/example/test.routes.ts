import type { Hono } from 'hono';
import * as HelloController from '../../controllers/example/hello.controller.ts';

export const registerTestRoutes = (app: Hono) => {
    app.get('/', HelloController.getHello);
    app.get('/health', HelloController.getHealth);
};
