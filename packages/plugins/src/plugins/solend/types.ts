export interface ApiResponse<T> {
  results: T[];
  next: null;
}

export interface LiquidityToken {
  coingeckoID: string;
  decimals: number;
  logo: string;
  mint: string;
  name: string;
  symbol: string;
  volume24h: string;
}

export interface MarketInfo {
  name: string;
  isPrimary: boolean;
  description: string;
  creator: string;
  address: string;
  hidden: boolean;
  authorityAddress: string;
  owner: string;
  reserves: {
    liquidityToken: LiquidityToken;
    pythOracle: string;
    switchboardOracle: string;
    address: string;
    collateralMintAddress: string;
    collateralSupplyAddress: string;
    liquidityAddress: string;
    liquidityFeeReceiverAddress: string;
    userBorrowCap?: number | string;
    userSupplyCap?: number | string;
  }[];
}

export interface ReserveInfo {
  reserve: ReserveData;
  rates: RatesInfo;
  rewards: RewardInfo[];
}

export interface ReserveData {
  version: number;
  lastUpdate: {
    slot: string;
    stale: number;
  };
  lendingMarket: string;
  liquidity: {
    mintPubkey: string;
    mintDecimals: number;
    supplyPubkey: string;
    pythOracle: string;
    switchboardOracle: string;
    availableAmount: string;
    borrowedAmountWads: string;
    cumulativeBorrowRateWads: string;
    marketPrice: string;
  };
  collateral: {
    mintPubkey: string;
    mintTotalSupply: string;
    supplyPubkey: string;
  };
  config: {
    optimalUtilizationRate: number;
    loanToValueRatio: number;
    liquidationBonus: number;
    liquidationThreshold: number;
    minBorrowRate: number;
    optimalBorrowRate: number;
    maxBorrowRate: number;
    depositLimit: string;
    borrowLimit: string;
    feeReceiver: string;
    protocolLiquidationFee: number;
    protocolTakeRate: number;
    borrowedAmountWads: string;
  };
}

export interface RatesInfo {
  supplyInterest: string;
  borrowInterest: string;
}

export interface RewardInfo {
  rewardMint: string;
  rewardSymbol: string;
  apy: string;
  side: string;
}

export type ReserveRewards = {
  rates: RatesInfo;
  additionalRewards: {
    supply: RewardInfo[];
    borrow: RewardInfo[];
  };
};
