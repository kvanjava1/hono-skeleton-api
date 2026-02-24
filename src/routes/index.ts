import { Hono } from "hono";
import { registerAuthRoutes } from "./auth.routes.ts";
import { registerTiktokRoutes } from "./tiktok.routes.ts";
import { m2mLoggerMiddleware } from '../middlewares/m2mLogger.middleware.ts';
import { m2mAuthMiddleware } from '../middlewares/m2mAuth.middleware.ts';

export const registerAllRoutes = (app: Hono) => {
  const api = new Hono();

  // 1. Logger applies to ALL /api routes
  api.use('/*', m2mLoggerMiddleware);

  // 2. Auth applies to everything EXCEPT token generation
  // We apply it here to the 'api' instance, but excluding the /m2m/token path
  api.use('/m2m/me', m2mAuthMiddleware);
  api.use('/tiktok/*', m2mAuthMiddleware);

  registerAuthRoutes(api);
  registerTiktokRoutes(api);

  app.route('/api', api);
};
