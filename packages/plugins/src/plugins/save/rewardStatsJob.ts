import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import {
  platformId,
  externalRewardStatsEndpoint,
  rewardStatsPrefix,
  rewardStatsKey,
} from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { RewardStat } from './types';

/**
 * @deprecated
 */
const executor: JobExecutor = async (cache: Cache) => {
  const rewardStatsRes = await axios.get<RewardStat[]>(
    externalRewardStatsEndpoint
  );

  await cache.setItem(rewardStatsKey, rewardStatsRes.data, {
    prefix: rewardStatsPrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-reward-stats`,
  executor,
  labels: ['normal'],
};
export default job;
