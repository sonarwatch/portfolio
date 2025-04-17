import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsCacheKey, platformId, poolsApi } from './constants';
import { PoolApiResponse, PoolData } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const pools: AxiosResponse<PoolApiResponse> = await axios.get(poolsApi);

  const poolsData: PoolData[] = pools.data.datas.map((pool) => ({
    borrowApy: pool.borrowApy,
    depositApy: pool.supplyApy,
    poolAddress: pool.poolAddress,
    token: pool.tokenAddress,
  }));

  await cache.setItem(marketsCacheKey, poolsData, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });
};
const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
