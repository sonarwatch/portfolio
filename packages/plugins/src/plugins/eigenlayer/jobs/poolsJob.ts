import { NetworkId } from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { platformId } from '../constants';

import { getYieldPositions } from './yield';

const executor: JobExecutor = async (cache: Cache) => {
  // Get the YIELD positions
  const strategiesAndUnderlyingTokensWithDecimals = await getYieldPositions(
    NetworkId.ethereum
  );

  // Cache the strategies and underlying tokens with decimals
  await cache.setItem(
    'eigenlayer-strategies',
    strategiesAndUnderlyingTokensWithDecimals,
    {
      prefix: platformId,
      networkId: NetworkId.ethereum,
    }
  );
};

const job: Job = {
  id: `${platformId}-strategies`,
  executor,
  labels: ['normal'],
};

export default job;
