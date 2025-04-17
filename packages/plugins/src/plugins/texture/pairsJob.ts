import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { pairsCacheKey, platformId } from './constants';
import { Pair } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const pairs = await axios.get<AxiosResponse<Pair[]>>(
    `https://moneyback.texture.finance/pairs`
  );

  await cache.setItem(pairsCacheKey, pairs.data, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-pairs`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
