import Fastify from 'fastify';
import dotenv from 'dotenv';

import { fastifyLogger, logger } from './logger/logger';
import { initPortfolioRoutes } from './routes/portfolio';

const start = async () => {
  try {
    dotenv.config();
    const fastify = Fastify({ logger: fastifyLogger });

    initPortfolioRoutes(fastify);

    const port = Number(process.env['PORT'] || 3001);
    const host = process.env['HOST'] || '0.0.0.0';
    await fastify.listen({ port, host });
    logger.info(`🚀 Server is running on http://localhost:${port} PID: ${process.pid}`);
  } catch (error) {
    logger.error(error, '❌ Server failed to start');
    process.exit(1);
  }
};

start();
