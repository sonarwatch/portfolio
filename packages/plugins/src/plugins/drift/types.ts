import { SpotMarket } from './struct';

export type SpotMarketEnhanced = SpotMarket & {
  depositApr: number;
  borrowApr: number;
};

export type PreMarketPrice = {
  id: string;
  price: number;
};

export type PerpMarketIndexes = Array<[number, string]>;
