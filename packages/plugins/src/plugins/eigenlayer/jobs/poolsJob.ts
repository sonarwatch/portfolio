import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { cacheKey, chain, platformId } from '../constants';

import { getYieldPositions } from './yield';

const executor: JobExecutor = async (cache: Cache) => {
  // Get the YIELD positions
  const strategiesAndUnderlyingTokensWithDecimals = await getYieldPositions(
    chain
  );

  // Cache the strategies and underlying tokens with decimals
  await cache.setItem(
    cacheKey.strategies,
    strategiesAndUnderlyingTokensWithDecimals,
    {
      prefix: platformId,
      networkId: chain,
    }
  );
};

const job: Job = {
  id: `${platformId}-strategies`,
  executor,
  labels: ['normal'],
};

export default job;
