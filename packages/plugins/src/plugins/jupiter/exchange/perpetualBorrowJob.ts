import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { perpBorrowAprCacheKey, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const apiRes = await axios.get<{ borrowApr: string }>(
    'https://perps-api.jup.ag/v1'
  );

  if (apiRes.data.borrowApr) {
    await cache.setItem(perpBorrowAprCacheKey, apiRes.data.borrowApr, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-perpetual-borrow-apr`,
  executor,
  labels: ['normal'],
};
export default job;
