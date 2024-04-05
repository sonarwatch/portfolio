import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { marketsCachePrefix, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  await cache.setItem('market_id', 'market_object', {
    prefix: marketsCachePrefix,
    networkId: NetworkId.ethereum,
  });
};
const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};
export default job;
