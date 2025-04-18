import { Job } from '../../Job';
import getWhirlpoolsJob from '../orca/getWhirlpoolsJob';
import { clmmPid, platformId } from './constants';
import { NetworkId } from '@sonarwatch/portfolio-core';

// Based on Orca Whirlpools (CLMM)
const job: Job = {
  id: `${platformId}-clmm`,
  executor: getWhirlpoolsJob(clmmPid),
  labels: ['normal', NetworkId.solana],
};
export default job;
