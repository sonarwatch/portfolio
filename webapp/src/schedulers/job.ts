import { FastifyInstance } from 'fastify';
import jobsSchedule from '../config/jobs_schedule.json';
import { scheduleJob } from '../services/job';

const scheduleJobs = (_app: FastifyInstance) => {
  Object.entries(jobsSchedule).forEach(([job, config]) => {
    scheduleJob({ jobName: job, config });
  });
};

export { scheduleJobs };
