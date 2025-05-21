import { Cache, getCache, jobs } from '@sonarwatch/portfolio-plugins';
import { logger } from '../logger/logger';
import { ScheduleJobRequest } from '../model/job';

class JobRunner {
  private static instance: JobRunner;

  private readonly jobsLimit: number;
  private readonly cache: Cache;

  private jobsQueue: Array<() => void>;
  private scheduledTasks: Array<NodeJS.Timeout>;
  private runningJobsCount: number;

  private constructor() {
    this.jobsLimit = 10;
    this.runningJobsCount = 0;
    this.jobsQueue = [];
    this.scheduledTasks = [];
    this.cache = getCache();
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
      try {
        const startDate = Date.now();
        logger.info(`Running job. Id=${jobName}`);
        await job.executor(this.cache);
        const duration = ((Date.now() - startDate) / 1000).toFixed(2);
        logger.info(
          `Job finished. Id=${jobName} Duration=(${duration}s) Queue=${this.jobsQueue.length} RunningJobs=${this.runningJobsCount}`
        );
      } catch (err) {
        logger.error({ error: err }, `Job failed. Name=${jobName}`);
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

    runWithThrottle();

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
