import { Cache } from '../../Cache';
import usdExchangeRateJob from './usdExchangeRateJob';
import getRatesFromCoinGecko from './coin-gecko/getRates';
import getRatesFromCoinConvert from './coin-convert/getRates';

jest.mock('./coin-gecko/getRates');
jest.mock('./coin-convert/getRates');

const cache = new Cache({
  type: 'memory',
  params: {},
});

describe('usdExchangeRateJob', () => {
  it('should get rates from coinGecko', async () => {
    await usdExchangeRateJob.executor(cache);
    // Check if called getRatesFromCoinGecko
    expect(getRatesFromCoinGecko).toHaveBeenCalled();
  });

  it('should get rates from coinConvert if coinGecko fails', async () => {
    (getRatesFromCoinGecko as jest.Mock).mockRejectedValue(new Error('test'));
    await usdExchangeRateJob.executor(cache);
    expect(getRatesFromCoinConvert).toHaveBeenCalled();
  });
});
