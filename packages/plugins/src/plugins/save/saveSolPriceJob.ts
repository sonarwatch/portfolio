import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const address = 'SAVEDpx3nFNdzG3ymJfShYnrBuYy7LtQEABZQ3qtTFt';

  const pricesRes = await axios.get<{ results: [{ price: number }] }>(
    `https://api.save.finance/v1/prices?symbols=${address}`
  );
  if (!pricesRes || !pricesRes.data || pricesRes.data.results.length !== 1)
    throw new Error('Error on saveSol price request');

  await cache.setTokenPriceSource({
    address,
    networkId: NetworkId.solana,
    decimals: 9,
    id: 'Save API',
    platformId: walletTokensPlatformId,
    price: pricesRes.data.results[0].price,
    timestamp: Date.now(),
    weight: 1,
  });
};

const job: Job = {
  id: `${platformId}-savesol-price`,
  executor,
  labels: ['normal'],
};
export default job;
