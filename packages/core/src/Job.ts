import { Context } from './Context';

export type JobExecutor = (context: Context) => Promise<void>;
export type Job = {
  id: string;
  executor: JobExecutor;
};
