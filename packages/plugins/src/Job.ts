import { NetworkIdType } from '@sonarwatch/portfolio-core';
import { Cache } from './Cache';

export type JobExecutor = (cache: Cache) => Promise<void>;
export type JobLabel =
  | 'realtime'
  | 'normal'
  | 'slow'
  | 'coingecko'
  | 'evm'
  | NetworkIdType;
export type Job = {
  id: string;
  executor: JobExecutor;
  labels: JobLabel[];
};
