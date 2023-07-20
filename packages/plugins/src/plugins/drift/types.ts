import { SpotMarket } from './struct';

export type SpotMarketEnhanced = SpotMarket & {
  depositApr: number;
  borrowApr: number;
};
