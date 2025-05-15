import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import getWhirlpoolsJob from '../orca/getWhirlpoolsJob';
import { clmmPid, platformId } from './constants';

// Based on Orca Whirlpools (CLMM)
const job: Job = {
  id: `${platformId}-clmm`,
  networkIds: [NetworkId.solana],
  executor: getWhirlpoolsJob(clmmPid),
  labels: ['normal', NetworkId.solana],
};
export default job;
