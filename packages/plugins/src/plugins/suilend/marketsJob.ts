import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { mainMarket, marketsKey, platformId } from './constants';
import { LendingMarket } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const marketsObjects = await multiGetObjects<LendingMarket>(client, [
    mainMarket,
  ]);

  await cache.setItem(
    marketsKey,
    marketsObjects.map((object) => object.data?.content?.fields),
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
  label: 'normal',
};
export default job;
