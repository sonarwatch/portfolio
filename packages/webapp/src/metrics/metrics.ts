import { Counter, Gauge } from 'prom-client';

class MetricsService {
  private static instance: MetricsService;

  private readonly jobErrorsCounter: Counter;
  private readonly jobRunsCounter: Counter;
  private readonly jobLastSuccess: Gauge;

  private constructor() {
    this.jobErrorsCounter = new Counter({
      name: 'job_errors_counter',
      help: 'Shows amount of error per job',
      labelNames: ['job'],
    });
    this.jobRunsCounter = new Counter({
      name: 'job_executions_counter',
      help: 'Shows how many times job was executed',
      labelNames: ['job'],
    });
    this.jobLastSuccess = new Gauge({
      name: 'last_success_job_execution_time',
      help: 'Shows last time when job was executed successfully',
      labelNames: ['job'],
    });
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  public incrementJobError(job: string) {
    this.jobErrorsCounter.inc({ job });
  }

  public incrementJobRun(job: string) {
    this.jobRunsCounter.inc({ job });
  }

  public setJobSuccess(job: string, time: number) {
    this.jobLastSuccess.set({ job }, time);
  }
}

export default MetricsService.getInstance();
