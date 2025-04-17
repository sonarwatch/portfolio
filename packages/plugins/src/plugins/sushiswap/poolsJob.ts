import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { ethereumTheGraphV2, platformId, theGraphV3 } from './constants';
import { getV3PairsAddresses } from './helpers';
import { getPairsV2FromTheGraph } from '../uniswap-v2/helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const networkId = NetworkId.ethereum;

  // do some stuff
  const pairsV3 = await getV3PairsAddresses(theGraphV3, 150);
  const pairsV2 = await getPairsV2FromTheGraph(ethereumTheGraphV2, 200);
  const pairs = [...pairsV2, ...pairsV3];

  const tokenAddresses = [
    ...new Set(pairs.map((p) => [p.token0.id, p.token1.id]).flat()),
  ];
  const tokenPrices = await cache.getTokenPrices(tokenAddresses, networkId);
  const tokenPricesByAddress: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tp) => {
    if (!tp) return;
    tokenPricesByAddress.set(tp.address, tp);
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.ethereum],
  executor,
  labels: ['normal', NetworkId.ethereum],
};
export default job;
