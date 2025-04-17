import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { api, marketsCacheKey, platformId } from './constants';
import { MarketsResponse } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const markets: AxiosResponse<MarketsResponse> = await axios.get(api);

  if (!markets.data) return;

  await cache.setItem(marketsCacheKey, markets.data.data, {
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
