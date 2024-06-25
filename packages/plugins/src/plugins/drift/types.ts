import { SpotMarket } from './struct';

export type SpotMarketEnhanced = SpotMarket & {
  depositApr: number;
  borrowApr: number;
};

export type PreMarketPrice = {
  id: string;
  price: number;
};

export type AirdropResponse = {
  claimant: string;
  merkle_tree: string;
  mint: string;
  start_ts: number;
  end_ts: number;
  start_amount: number;
  end_amount: number;
  unvested_amount: number;
  claimed_amount: number;
  error: string;
};

export type AirdropInfo = {
  merkle: string;
  amount: number;
};

export type PerpMarketIndexes = Array<[number, string]>;
