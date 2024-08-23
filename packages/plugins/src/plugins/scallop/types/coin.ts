import { CoinMetadata } from '@mysten/sui.js/client';
import { CoinNames, MARKET_COIN_NAMES } from '../constants';

export const SUPPORTED_SPOOL_COIN_NAMES = ['ssui', 'susdc'] as const;

export type MarketCoinNames = (typeof MARKET_COIN_NAMES)[number];
export type SupportedSpoolCoinNames =
  (typeof SUPPORTED_SPOOL_COIN_NAMES)[number];

export type AllCoinNames = CoinNames | MarketCoinNames;
export type UserCoinBalance = {
  [k in AllCoinNames]?: string;
};

export type CoinTypeMetadata = {
  coinType: string;
  metadata: CoinMetadata | null;
};
