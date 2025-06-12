import Fastify from 'fastify';
import metricsPlugin from 'fastify-metrics';
import axios from 'axios';
import dotenv from 'dotenv';
import v8 from 'v8';

dotenv.config();
axios.defaults.timeout = 120000;

import { fastifyLogger, logger } from './logger/logger';

console.log = (...args) => logger.info(args.join(' '));
console.info = (...args) => logger.info(args.join(' '));
console.warn = (...args) => logger.warn(args.join(' '));
console.error = (...args) => logger.error(args.join(' '));

import { initPortfolioRoutes } from './routes/portfolio';
import programService from './services/program';
import { scheduleJobs } from './schedulers/job';

const start = async () => {
  try {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('⚠️ Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('🔥 Uncaught Exception:', err);
    });

    const mainServer = Fastify({ logger: fastifyLogger });
    const metricsServer = Fastify({ logger: fastifyLogger });

    await metricsServer.register(metricsPlugin, {
      endpoint: '/metrics',
      defaultMetrics: { enabled: false },
      routeMetrics: { enabled: false },
    });
    await mainServer.register(metricsPlugin, {
      endpoint: null,
      defaultMetrics: { enabled: true },
      routeMetrics: { enabled: true },
    });

    const isJobRunner = process.env['PORTFOLIO_JOB_RUNNER'] === 'true';
    if (isJobRunner) {
      mainServer.addHook('onReady', () => {
        logger.info('Running in worker mode.');
        scheduleJobs(mainServer);
      });
    } else {
      logger.info('Running in web-api mode.');
      initPortfolioRoutes(mainServer);

      mainServer.addHook('onListen', async () => {
        await programService.warmupProgramsCache();
      });
    }

    const port = Number(process.env['PORTFOLIO_PORT'] || 3001);
    const host = process.env['PORTFOLIO_HOST'] || '0.0.0.0';
    await mainServer.listen({ port, host });

    const metricsPort = Number(process.env['PORTFOLIO_METRICS_PORT'] || 9090);
    const metricsHost = process.env['PORTFOLIO_METRICS_HOST'] || '0.0.0.0';
    await metricsServer.listen({ port: metricsPort, host: metricsHost });

    const totalHeapSize = v8.getHeapStatistics().total_available_size;
    const totalHeapSizeinGB = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);

    logger.info(
      `🚀 Server is running on http://localhost:${port} PID: ${process.pid}. Heap Size: ${totalHeapSizeinGB}`
    );
  } catch (error) {
    logger.error(error, '❌ Server failed to start');
    process.exit(1);
  }
};

start();
