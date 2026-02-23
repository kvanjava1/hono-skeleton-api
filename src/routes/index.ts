import { Hono } from "hono";
import { registerAuthRoutes } from "./auth.routes.ts";
import { registerTiktokRoutes } from "./tiktok.routes.ts";
import { m2mLoggerMiddleware } from '../middlewares/m2mLogger.middleware.ts';
import { m2mAuthMiddleware } from '../middlewares/m2mAuth.middleware.ts';

export const registerAllRoutes = (app: Hono) => {
  const api = new Hono();

  // Apply both middlewares to ALL /api routes
  // Using '/*' because this router is already mounted at '/api'
  api.use('/*', m2mLoggerMiddleware, m2mAuthMiddleware);

  registerAuthRoutes(api);
  registerTiktokRoutes(api);

  app.route('/api', api);
};
