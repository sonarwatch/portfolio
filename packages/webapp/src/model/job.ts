import { JobPriority } from '../enum/job';

export interface ScheduleJobRequest {
  jobName: string;
  config: JobConfig;
}

export interface JobConfig {
  intervalMs: number;
  priority?: JobPriority;
}
