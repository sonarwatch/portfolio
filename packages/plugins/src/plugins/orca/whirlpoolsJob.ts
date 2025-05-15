import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { platformId, whirlpoolProgram } from './constants';
import getWhirlpoolsJob from './getWhirlpoolsJob';

const job: Job = {
  id: `${platformId}-whirlpools`,
  networkIds: [NetworkId.solana],
  executor: getWhirlpoolsJob(whirlpoolProgram),
  labels: ['normal', NetworkId.solana],
};
export default job;
