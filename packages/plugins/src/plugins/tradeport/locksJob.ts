import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { locksCacheKey, lockStore, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const locks = await getDynamicFieldObjects<Lock>(client, lockStore, {
    showContent: true,
  });

  await cache.setItem(
    locksCacheKey,
    locks.map((l) => l.data?.content).filter((l) => l !== null),
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: `${platformId}-locks`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['realtime', NetworkId.sui],
};
export default job;
