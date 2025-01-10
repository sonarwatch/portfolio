import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsApiUrl, marketsCacheKey, platformId } from './constants';
import { Market } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res: AxiosResponse<{
    data: Market[];
  }> = await axios.get(marketsApiUrl);

  await cache.setItem(marketsCacheKey, res.data.data, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};

export default job;
