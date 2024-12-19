import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsStats, poolsV3StatsInfoKey } from './constants';
import { PoolStat } from './types/pools';

const executor: JobExecutor = async (cache: Cache) => {
  const apiRes: AxiosResponse<PoolStat[]> | null = await axios
    .get(poolsStats)
    .catch(() => null);

  if (!apiRes) return;

  const poolsInfo: PoolStat[] = [];
  for (const pool of apiRes.data) {
    poolsInfo.push({
      pool_id: pool.pool_id,
      volume_24h: pool.volume_24h,
      fee_collected_24h: pool.fee_collected_24h,
      fee_rate: pool.fee_rate,
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
  executor,
  label: 'normal',
};
export default job;
