import { Cache } from './Cache';

export type JobExecutor = (cache: Cache) => Promise<void>;
export type Job = {
  id: string;
  executor: JobExecutor;
};
