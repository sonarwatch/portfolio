import { getCache, jobs } from '@sonarwatch/portfolio-plugins';
import { logger } from '../logger/logger';

const scheduleJob = async ({ jobName, config }: any) => {
  logger.info(`Received job ${jobName} with config ${JSON.stringify(config)}`);
  const job = jobs.find((job) => job.id === jobName);
  if (!job) {
    logger.warn(`Job not found. Name=${jobName}`);
    return;
  }

  try {
    const cache = getCache();
    const startDate = Date.now();
    logger.info(`Job found. Id=${jobName}`);
    await job.executor(cache);
    const duration = ((Date.now() - startDate) / 1000).toFixed(2);
    logger.info(`Job finished. Id=${jobName} Duration=(${duration}s)`);
  } catch (err) {
    logger.error(err, `Failed to execute job. Id=${jobName}`);
  }
};

export { scheduleJob };
