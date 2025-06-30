import {
  NetworkId,
  yieldFromApr,
  yieldFromApy,
} from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsKey } from './constants';
import { PoolInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const [apiData, pools] = await Promise.all([
    axios.get<{
      pools: {
        poolAddress: string;
        flpWeeklyApy: number;
        sflpWeeklyApr: number;
      }[];
    }>('https://api.prod.flash.trade/earn-page/data'),
    cache.getItem<PoolInfo[]>(poolsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!pools) return;

  await cache.setTokenYields(
    apiData.data.pools.flatMap((pool) => {
      const poolFromCache = pools.find((p) => p.pkey === pool.poolAddress);
      if (!poolFromCache) return [];
      return [
        {
          address: poolFromCache.flpMint,
          networkId: NetworkId.solana,
          yield: yieldFromApy(pool.flpWeeklyApy / 100),
          timestamp: Date.now(),
        },
        {
          address: poolFromCache.compoundingMint,
          networkId: NetworkId.solana,
          yield: yieldFromApr(pool.sflpWeeklyApr / 100),
          timestamp: Date.now(),
        },
      ];
    })
  );
};

const job: Job = {
  id: `${platformId}-pools-yield`,
  executor,
  labels: ['normal'],
};
export default job;
