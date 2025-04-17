import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsStats, poolsV3StatsInfoKey } from './constants';
import { PoolStat } from './types/pools';

const executor: JobExecutor = async (cache: Cache) => {
  const apiRes: AxiosResponse<{ data: PoolStat[] }> | null = await axios.get(
    poolsStats
  );

  if (!apiRes) return;

  const poolsInfo: PoolStat[] = [];
  for (const pool of apiRes.data.data) {
    poolsInfo.push({
      poolId: pool.poolId,
      volume24h: pool.volume24h,
      fees24h: pool.fees24h,
      apy: pool.apy,
      tvl: pool.tvl,
    });
  }

  await cache.setItem(poolsV3StatsInfoKey, poolsInfo, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-pools-v3-stats`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
