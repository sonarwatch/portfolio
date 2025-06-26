import { Cache, jobs } from '@sonarwatch/portfolio-plugins';
import { logger } from '../logger/logger';
import { ScheduleJobRequest } from '../model/job';
import portfolioCache from '../cache/cache';
import metricsService from '../metrics/metrics';
import { JobPriority } from '../enum/job';
import dotenv from 'dotenv';

class JobRunner {
  private static instance: JobRunner;

  private readonly jobsLimit: number;
  private readonly cache: Cache;

  private jobsQueue: Array<() => void>;
  private scheduledTasks: Array<NodeJS.Timeout>;
  private runningJobsCount: number;

  private constructor() {
    dotenv.config();
    this.jobsLimit = process.env['PORTFOLIO_JOB_PARALLEL_RUNS']
      ? parseInt(process.env['PORTFOLIO_JOB_PARALLEL_RUNS'], 10)
      : 10;
    this.runningJobsCount = 0;
    this.jobsQueue = [];
    this.scheduledTasks = [];
    this.cache = portfolioCache.getCache();
  }

  public static getInstance(): JobRunner {
    if (!JobRunner.instance) {
      JobRunner.instance = new JobRunner();
    }
    return JobRunner.instance;
  }

  public schedule({ jobName, config }: ScheduleJobRequest) {
    logger.info(`Scheduling job. Id=${jobName}`);

    const job = jobs.find((job) => job.id === jobName);
    if (!job) {
      logger.warn(`Job not found. Could not be scheduled. Name=${jobName}`);
      return;
    }

    const runTask = async () => {
      this.runningJobsCount++;
      const startDate = Date.now();
      try {
        logger.info(`Running job. Id=${jobName}`);
        metricsService.incrementJobRun(jobName);
        await job.executor(this.cache);
        const duration = ((Date.now() - startDate) / 1000).toFixed(2);
        logger.info(
          `Job finished. Id=${jobName} Duration=(${duration}s) Queue=${this.jobsQueue.length} RunningJobs=${this.runningJobsCount}`
        );
        metricsService.setJobSuccess(jobName, Date.now());
      } catch (err) {
        const duration = ((Date.now() - startDate) / 1000).toFixed(2);
        logger.error({ error: err }, `Job failed. Id=${jobName} Duration=(${duration}s)`);
        metricsService.incrementJobError(jobName);
      } finally {
        this.runningJobsCount--;
        this.tryNext();
      }
    };

    const runWithThrottle = () => {
      if (this.runningJobsCount < this.jobsLimit) {
        logger.info(
          `There is ${this.runningJobsCount} running job. Limit=${this.jobsLimit}. Queue=${this.jobsQueue.length}`
        );
        runTask();
      } else {
        logger.info(
          `Jobs Limit is reached. Waiting. Limit=${this.jobsLimit}. Queue=${this.jobsQueue.length}`
        );
        this.jobsQueue.push(runWithThrottle);
      }
    };

    if (config.priority === JobPriority.HIGH) {
      runWithThrottle();
    } else {
      const randomDelay = Math.floor(Math.random() * 120_000);
      setTimeout(() => {
        runWithThrottle();
      }, randomDelay);
    }


    const timer = setInterval(() => {
      runWithThrottle();
    }, config.intervalMs);
    this.scheduledTasks.push(timer);
  }

  private tryNext() {
    while (
      this.runningJobsCount < this.jobsLimit &&
      this.jobsQueue.length > 0
    ) {
      const next = this.jobsQueue.shift();
      next?.();
    }
  }

  public stopAll() {
    for (const timer of this.scheduledTasks) {
      clearInterval(timer);
    }
    this.scheduledTasks = [];
    this.jobsQueue = [];
  }
}

export default JobRunner.getInstance();
