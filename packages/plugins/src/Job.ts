import { Cache } from './Cache';

export type JobExecutor = (cache: Cache) => Promise<void>;
export type JobLabel = 'normal' | 'coingecko' | 'realtime';
export type Job = {
  id: string;
  executor: JobExecutor;
  label: JobLabel;
};
