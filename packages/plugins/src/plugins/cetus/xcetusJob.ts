import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { cetusMint, platformId, xCetusMint } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const cetusPrice = await cache.getTokenPrice(cetusMint, NetworkId.sui);
  if (!cetusPrice) return;

  await cache.setTokenPriceSource({
    address: xCetusMint,
    decimals: cetusPrice.decimals,
    id: 'cetus',
    networkId: NetworkId.sui,
    platformId,
    price: cetusPrice.price,
    timestamp: Date.now(),
    weight: 1,
  });
};

const job: Job = {
  id: `${platformId}-xcetus`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
