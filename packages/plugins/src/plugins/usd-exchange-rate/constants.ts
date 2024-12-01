import { Currency } from './types';

export const currencies: Currency[] = [
  {
    name: 'EUR',
    coinGeckoId: 'eur',
    coinConvertId: 'EUR',
    type: 'fiat',
  },
  {
    name: 'SOL',
    coinGeckoId: 'solana',
    coinConvertId: 'SOL',
    type: 'crypto',
  },
  {
    name: 'BTC',
    coinGeckoId: 'bitcoin',
    coinConvertId: 'BTC',
    type: 'crypto',
  },
  {
    name: 'JPY',
    coinGeckoId: 'japanese-yen',
    coinConvertId: 'JPY',
    type: 'fiat',
  },
  {
    name: 'ETH',
    coinGeckoId: 'ethereum',
    coinConvertId: 'ETH',
    type: 'crypto',
  },
  {
    name: 'GBP',
    coinGeckoId: 'gbp',
    coinConvertId: 'GBP',
    type: 'fiat',
  },
];

export const currencyCodeNames = currencies.map((currency) => currency.name);
