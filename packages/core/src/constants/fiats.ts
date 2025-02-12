import { NetworkIdType } from '../Network';

export const fiatCurrencies: Currency[] = [
  {
    name: 'USD',
    coinGeckoId: 'usd',
    symbol: '$',
    type: 'fiat',
  },
  {
    name: 'EUR',
    coinGeckoId: 'eur',
    symbol: '€',
    type: 'fiat',
    symbolAfter: true,
  },
  {
    name: 'GBP',
    coinGeckoId: 'gbp',
    symbol: '£',
    type: 'fiat',
  },
  {
    name: 'JPY',
    coinGeckoId: 'japanese-yen',
    symbol: '¥',
    type: 'fiat',
  },
  {
    name: 'AED',
    coinGeckoId: 'united-arab-emirates-dirham',
    symbol: 'AED',
    type: 'fiat',
    symbolAfter: true,
  },
  {
    name: 'AUD',
    coinGeckoId: 'australien-dollar',
    symbol: 'A$',
    type: 'fiat',
  },
  {
    name: 'CAD',
    coinGeckoId: 'canadian-dollar',
    symbol: 'CA$',
    type: 'fiat',
  },
  {
    name: 'SGD',
    coinGeckoId: 'singapore-dollar',
    symbol: 'S$',
    type: 'fiat',
  },
  {
    name: 'INR',
    coinGeckoId: 'Indian Rupee',
    symbol: '₹',
    type: 'fiat',
  },
];

export type Currency = {
  type: 'fiat' | 'token';
  name: string;
  coinGeckoId?: string;
  symbol: string;
  symbolAfter?: boolean;
  address?: string;
  networkId?: NetworkIdType;
};

export type PricedCurrency = Currency & {
  rateToUsd?: number;
  rateToBtc?: number;
  priceUsd?: number;
  priceBtc?: number;
};
