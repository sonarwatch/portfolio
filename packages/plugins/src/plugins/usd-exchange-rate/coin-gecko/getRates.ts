import { currencies } from '../constants';
import { JobData } from '../types';
import getCryptoRate from './crypto/getCryptoRate';
import getFiatRate from './fiat/getFiatRate';
import getFiatToBtcRates from './getFiatToBtcRates';
import getRatesFromCoinGecko from './getRatesFromCoinGecko';

export default async function getRates(): Promise<JobData> {
  const names = currencies.map((currency) => currency.coinGeckoId);
  const [cryptoRates, fiatRates] = await Promise.all([
    getRatesFromCoinGecko(names),
    getFiatToBtcRates(),
  ]);
  const crypto = currencies
    .filter((c) => c.type === 'crypto')
    .map((currency) => ({
      [currency.name]: getCryptoRate(cryptoRates, currency),
    }));
  const fiat = currencies
    .filter((c) => c.type === 'fiat')
    .map((currency) => ({
      [currency.name]: getFiatRate(fiatRates, currency),
    }));
  return Object.assign({}, ...crypto, ...fiat);
}
