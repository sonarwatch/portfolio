import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { jupMint } from '../jupiter/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const jupPrice = await cache.getTokenPrice(jupMint, NetworkId.solana);
  if (!jupPrice) return;

  await cache.setTokenPriceSource({
    address: 'stJUPZMmAWA1PNVPXCvqVK6MHABr4yFo5rv2JTethCa',
    networkId: NetworkId.solana,
    decimals: 6,
    price: jupPrice.price,
    id: platformId,
    platformId: walletTokensPlatformId,
    timestamp: Date.now(),
    weight: 1,
    link: 'https://liquid.rain.fi/jupiter',
  });
};

const job: Job = {
  id: `${platformId}-stJup`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime'],
};
export default job;
