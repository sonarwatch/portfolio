import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import getRatesFromCoinConvert from './coin-convert/getRates';
import getRatesFromCoinGecko from './coin-gecko/getRates';
import { type JobData } from './types';

const usdExchangeRateJob: JobExecutor = async (cache: Cache) => {
  let data: JobData;

  // Try getting data from coinGueko
  try {
    data = await getRatesFromCoinGecko();
  } catch (error) {
    // Fallback to coinConvert
    data = await getRatesFromCoinConvert();
  }

  await cache.setItem('rates', data, {
    prefix: 'usd-exchange-rate',
    ttl: 1000 * 60 * 60, // 1 hour
  });
};

const job: Job = {
  id: `usd-exchange-rate`,
  executor: usdExchangeRateJob,
  label: 'coingecko',
};

export default job;
