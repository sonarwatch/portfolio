import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const sSolPrice = await cache.getTokenPrice(
    'sSo14endRuUbvQaJS3dq36Q829a3A6BEfoeeRGJywEh', // sSOL
    NetworkId.solana
  );
  if (!sSolPrice) return;

  await cache.setTokenPriceSource({
    address: '4tARAT4ssRYhrENCTxxZrmjL741eE2G23Q1zLPDW2ipf',
    decimals: 9,
    id: 'adrastea',
    networkId: NetworkId.solana,
    platformId,
    price: sSolPrice.price,
    timestamp: Date.now(),
    weight: 1,
  });
};

const job: Job = {
  id: `${platformId}-lrtssol`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
