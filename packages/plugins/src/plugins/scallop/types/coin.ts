import { CoinMetadata } from "@mysten/sui.js";

export const COIN_NAMES = ['eth', 'btc', 'usdc', 'usdt', 'sui', 'apt', 'sol', 'cetus'] as const;

export const MARKET_COIN_NAMES = ['seth', 'sbtc', 'susdc', 'susdt', 'ssui', 'sapt', 'ssol', 'scetus'] as const;

export const SUPPORTED_SPOOL_COIN_NAMES = ['ssui', 'susdc'] as const;

export type CoinNames = (typeof COIN_NAMES)[number];
export type MarketCoinNames = (typeof MARKET_COIN_NAMES)[number];
export type SupportedSpoolCoinNames = (typeof SUPPORTED_SPOOL_COIN_NAMES)[number];

export type AllCoinNames = CoinNames | MarketCoinNames;
export type UserCoinBalance = {
  [k in AllCoinNames]?: string;
};

export type CoinTypeMetadata = {
  coinType: string;
  metadata: CoinMetadata | null;
};
