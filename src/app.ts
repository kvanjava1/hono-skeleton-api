import { Hono } from "hono";
import { setupMiddlewares } from "./middlewares/index.ts";
import { registerAllRoutes } from "./routes/index.ts";

const app = new Hono();

setupMiddlewares(app);
registerAllRoutes(app);

export { app };
