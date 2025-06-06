import { FastifyInstance } from 'fastify';
import jobsSchedule from '../config/jobs_schedule.json';
import jobRunner from '../services/job';
import tokenCache from '../cache/token';
import { JobConfig } from '../model/job';

const scheduleJobs = (_app: FastifyInstance) => {
  tokenCache.initRegistry();
  Object.entries(jobsSchedule).forEach(([job, config]) => {
    jobRunner.schedule({ jobName: job, config: config as JobConfig });
  });
};

export { scheduleJobs };
