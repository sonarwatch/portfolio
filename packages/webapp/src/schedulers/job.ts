import { FastifyInstance } from 'fastify';
import jobsSchedule from '../config/jobs_schedule.json';
import jobRunner from '../services/job';

const scheduleJobs = (_app: FastifyInstance) => {

  Object.entries(jobsSchedule).forEach(([job, config]) => {
    jobRunner.schedule({ jobName: job, config });
  });
};

export { scheduleJobs };
