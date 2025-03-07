import { Job } from '../../Job';
import getWhirlpoolsJob from '../orca/getWhirlpoolsJob';
import { clmmPid, platformId } from './constants';

// Based on Orca Whirlpools (CLMM)
const job: Job = {
  id: `${platformId}-clmm`,
  executor: getWhirlpoolsJob(clmmPid),
  labels: ['normal'],
};
export default job;
