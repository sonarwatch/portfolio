import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { mPstMint, platformId } from './constants';
import { usdcSolanaMint } from '../../utils/solana';

const executor: JobExecutor = async (cache: Cache) => {
  const usdcPrice = await cache.getTokenPrice(usdcSolanaMint, NetworkId.solana);
  if (!usdcPrice) return;
  await cache.setTokenPriceSource({
    address: mPstMint,
    networkId: NetworkId.solana,
    decimals: 6,
    id: 'Huma',
    platformId: walletTokensPlatformId,
    price: usdcPrice.price,
    timestamp: Date.now(),
    weight: 1,
  });
};

const job: Job = {
  id: `${platformId}-token-stats`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
