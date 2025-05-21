export interface ScheduleJobRequest {
  jobName: string;
  config: JobConfig;
}

export interface JobConfig {
  intervalMs: number;
}
