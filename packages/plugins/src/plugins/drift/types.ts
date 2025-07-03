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

export type AirdropS3Response = {
  start_amount: number;
  end_amount: number;
  unvested_amount: number;
  claimed_amount: number;
  unlocked_amount_claimed: number;
  locked_amount_withdrawn: number;
  locked_amount: number;
  claimable_amount: number;
  claimant: string;
  merkle_tree: string;
  mint: string;
  error?: string;
  end_ts: number;
  start_ts: number;
};
