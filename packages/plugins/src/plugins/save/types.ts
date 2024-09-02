import { PublicKey } from '@solana/web3.js';

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
  token2022Mint: string;
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
  cTokenExchangeRate: string;
}

export type ReserveInfoExtended = ReserveInfo & {
  pubkey: string;
};

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
    addedBorrowWeightBPS: string;
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

export type ExternalReward = {
  rewardMint: string;
  rewardSymbol: string;
  reserveID: string;
  marketID: string;
  obligationID: string;
  side: string;
  tokenMint: string;
  balance: string;
  debt: string;
  score: string;
  lastSlot: number;
  lastTx: 'string';
};

export type RewardStat = {
  incentivizer: string;
  lastSlot: number;
  market: string;
  mint: string;
  reserveID: string;
  rewardMint: string;
  rewardSymbol: string;
  rewardsPerShare: string;
  side: string;
  tokenMint: string;
  totalBalance: string;
  rewardRates: {
    name: string;
    beginningSlot: number;
    rewardRate: number;
  }[];
};

export type Obligation = {
  obligationID: string;
  lotNumber: number;
  index: number;
  quantity: string;
  distributorPublicKey: string;
  name: string;
  incentivizer: string;
  distributor: {
    mint: string;
  };
};

export type ClaimData = {
  name: string;
  obligationID: string;
  lotNumber: number;
  index: number;
  quantity: string;
  root: string;
  proof: Array<string>;
  distributorPublicKey: PublicKey;
  optionMarketKey: PublicKey | null;
  incentivizer: string;
};

export type FullClaimDataType = ClaimData & {
  claimed: boolean;
  claimedAt: number;
  claimStatusBump: number;
  accountFunded: boolean;
  distributor: {
    mint: PublicKey;
    bump: number;
  };
  claimId: PublicKey;
  distributorATAPublicKey: PublicKey;
};
