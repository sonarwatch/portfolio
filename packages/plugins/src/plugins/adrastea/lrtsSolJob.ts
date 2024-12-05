import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const solPrice = await cache.getTokenPrice(
    solanaNativeAddress,
    NetworkId.solana
  );
  if (!solPrice) return;

  await cache.setTokenPriceSource({
    address: '4tARAT4ssRYhrENCTxxZrmjL741eE2G23Q1zLPDW2ipf',
    decimals: 9,
    id: 'adrastea',
    networkId: NetworkId.solana,
    platformId,
    price: solPrice.price,
    timestamp: Date.now(),
    weight: 1,
  });
};

const job: Job = {
  id: `${platformId}-lrtssol`,
  executor,
  label: 'normal',
};
export default job;
