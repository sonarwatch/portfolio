import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { platformId, poolsCacheKey } from './constants';
import { getAllPools } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const pools = await getAllPools(client);

  await cache.setItem(poolsCacheKey, pools, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
