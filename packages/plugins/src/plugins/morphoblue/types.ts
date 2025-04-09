export type MorphoAssetAPI = {
  address: string;
  decimals: number;
  logoURI: string | null;
  name: string;
  priceUsd: number | null;
  symbol: string;
};

export type MorphoMarketRes = {
  markets: {
    items: {
      uniqueKey: `0x${string}`;
      loanAsset: MorphoAssetAPI;
      collateralAsset: MorphoAssetAPI;
    }[];
  };
};
export type MorphoVaultRes = {
  vaults: {
    items: {
      address: string;
      asset: MorphoAssetAPI;
      symbol: string;
      name: string;
    }[];
  };
};

export type MorphoRewardsRes = {
  timestamp: string;
  pagination: {
    per_page: number;
    page: number;
    total_pages: number;
    next: null | number;
    prev: null | number;
  };
  data: RewardData[];
};

export type RewardData = {
  user: string;
  type: 'uniform-reward' | 'market-reward' | 'airdrop-reward';
  asset: Asset;
  program?: Program;
  program_id?: string;
  amount?: Amount;
  for_supply?: Amount;
  for_borrow?: Amount | null;
  for_collateral?: Amount | null;
  reallocated_from?: string;
};

export type Asset = {
  id: string;
  address: string;
  chain_id: number;
};

export type Program = {
  creator: string;
  start: string;
  end: string;
  created_at: string;
  blacklist: unknown[];
  type: string;
  distributor: Asset;
  asset: Asset;
  market_id: string;
  supply_rate_per_year: string;
  borrow_rate_per_year: string;
  collateral_rate_per_year: string;
  chain_id: number;
  id: string;
  cid_v0?: string;
  total_rewards?: string;
};

export type Amount = {
  total: string;
  claimable_now: string;
  claimable_next: string;
  claimed: string;
};
