import { serve } from 'bun';
import { app } from './app.ts';
import { connectAllDatabases, disconnectAllDatabases } from './database/index.ts';
import { configApp } from './configs/index.ts';
import { logger } from './utils/logger.ts';

const startServer = async () => {
  try {
    logger.info('Starting server...');
    logger.info(`Environment: ${configApp.nodeEnv}`);

    logger.info('Connecting to databases...');
    await connectAllDatabases();
    logger.info('All databases connected');

    const server = serve({
      port: configApp.port,
      fetch: app.fetch,
    });

    logger.info(`Server running on http://localhost:${configApp.port}`);
    logger.info('Press Ctrl+C to stop');

    process.on('SIGINT', async () => {
      logger.info('Shutting down server...');
      await disconnectAllDatabases();
      server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Shutting down server...');
      await disconnectAllDatabases();
      server.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
