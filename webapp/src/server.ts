import Fastify from 'fastify';
import metricsPlugin from 'fastify-metrics';
import dotenv from 'dotenv';

import { fastifyLogger, logger } from './logger/logger';
import { initPortfolioRoutes } from './routes/portfolio';
import { scheduleJobs } from './schedulers/job';

const start = async () => {
  try {
    dotenv.config();
    const mainServer = Fastify({ logger: fastifyLogger });
    const metricsServer = Fastify({ logger: fastifyLogger });

    mainServer.register(metricsPlugin, {
      endpoint: null,
      defaultMetrics: { enabled: true },
      routeMetrics: { enabled: true },
    });
    metricsServer.register(metricsPlugin, {
      endpoint: '/metrics',
      defaultMetrics: { enabled: false },
      routeMetrics: { enabled: false },
    });

    const isJobRunner = process.env.PORTFOLIO_JOB_RUNNER === 'true';
    if (isJobRunner) {
      logger.info('Running in worker mode.');
      scheduleJobs(mainServer);
    } else {
      logger.info('Running in web-api mode.');
      initPortfolioRoutes(mainServer);
    }

    const port = Number(process.env['PORTFOLIO_PORT'] || 3001);
    const host = process.env['PORTFOLIO_HOST'] || '0.0.0.0';
    await mainServer.listen({ port, host });

    const metricsPort = Number(process.env['PORTFOLIO_METRICS_PORT'] || 9090);
    const metricsHost = process.env['PORTFOLIO_METRICS_HOST'] || '0.0.0.0';
    await metricsServer.listen({ port: metricsPort, host: metricsHost });
    logger.info(
      `🚀 Server is running on http://localhost:${port} PID: ${process.pid}`
    );
  } catch (error) {
    logger.error(error, '❌ Server failed to start');
    process.exit(1);
  }
};

start();
