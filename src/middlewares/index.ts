import type { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { configCors } from "../configs/index.ts";
import { errorHandler } from "./errorHandler.ts";
import { rateLimiterMiddleware } from "./rateLimiter.ts";
import { requestLoggerMiddleware } from "./logger.ts";

export { errorHandler } from "./errorHandler.ts";
export { rateLimiterMiddleware } from "./rateLimiter.ts";
export { requestLoggerMiddleware } from "./logger.ts";

export const setupMiddlewares = (app: Hono) => {
  app.use(
    "*",
    cors({
      origin: configCors.origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use("*", secureHeaders());
  app.use("*", rateLimiterMiddleware);
  app.use("*", requestLoggerMiddleware);

  // Global Error Handler
  app.onError(errorHandler);
};
