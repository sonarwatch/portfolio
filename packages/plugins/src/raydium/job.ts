import { Job } from '@sonarwatch/portfolio-core';
import executor from './executor';

const job: Job = {
  id: 'raydium-solana',
  executor,
};
export default job;
