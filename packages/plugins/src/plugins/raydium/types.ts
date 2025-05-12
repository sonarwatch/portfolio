import { GetProgramAccountsFilter, PublicKey } from '@solana/web3.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { TokenPrice, Yield } from '@sonarwatch/portfolio-core';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { AmmInfoV4, AmmInfoV5 } from './structs/amms';
import {
  FarmAccount,
  FarmAccountV6,
  UserFarmAccountV3,
  UserFarmAccountV31,
  UserFarmAccountV4,
  UserFarmAccountV5,
  UserFarmAccountV61,
} from './structs/farms';
import { ParsedAccount } from '../../utils/solana';

export enum LiquidityPoolStatus {
  Uninitialized,
  Initialized,
  Disabled,
  RemoveLiquidityOnly,
  LiquidityOnly,
  OrderBook,
  Swap,
  WaitingForStart,
}

export type EnhancedAmmInfoV4 = AmmInfoV4 & {
  versionId: number;
  ammName: string;
};

export type EnhancedAmmInfoV5 = AmmInfoV5 & {
  versionId: number;
  ammName: string;
};

export type AmmInfo = AmmInfoV4 | AmmInfoV5;
export type EnhancedAmmInfo = EnhancedAmmInfoV4 | EnhancedAmmInfoV5;

export type UserFarmConfig = {
  programId: PublicKey;
  version: string;
  filters: (address: string) => GetProgramAccountsFilter[];
  struct:
    | BeetStruct<UserFarmAccountV3, Partial<UserFarmAccountV3>>
    | BeetStruct<UserFarmAccountV4, Partial<UserFarmAccountV4>>
    | BeetStruct<UserFarmAccountV5, Partial<UserFarmAccountV5>>
    | BeetStruct<UserFarmAccountV31, Partial<UserFarmAccountV31>>;
};

export type UserFarmConfigV6 = {
  programId: PublicKey;
  version: string;
  filters: (address: string) => GetProgramAccountsFilter[];
  struct: BeetStruct<UserFarmAccountV61, Partial<UserFarmAccountV61>>;
};

export type FarmConfig = {
  programId: PublicKey;
  version: string;
  d: number;
  filters: GetProgramAccountsFilter[];
  struct: BeetStruct<FarmAccount, Partial<FarmAccount>>;
};
export type FarmConfigV6 = {
  programId: PublicKey;
  version: string;
  d: number;
  filters: GetProgramAccountsFilter[];
  struct: BeetStruct<FarmAccountV6, Partial<FarmAccountV6>>;
};

export type FarmInfo = {
  account: ParsedAccount<FarmAccount>;
  lpToken: TokenPrice;
  d: number;
  rewardTokenA?: TokenPrice;
  rewardTokenB?: TokenPrice;
  yields?: Yield[];
};

export interface ClmmPoolRewardInfo {
  rewardState: number;
  openTime: BN;
  endTime: BN;
  lastUpdateTime: BN;
  emissionsPerSecondX64: BN;
  rewardTotalEmissioned: BN;
  rewardClaimed: BN;
  tokenMint: PublicKey;
  tokenVault: PublicKey;
  creator: PublicKey;
  rewardGrowthGlobalX64: BN;
  perSecond: Decimal;
  remainingRewards: undefined | BN;
  tokenProgramId: PublicKey;
}

export interface ClmmPoolInfo {
  id: PublicKey;
  mintA: {
    programId: PublicKey;
    mint: PublicKey;
    vault: PublicKey;
    decimals: number;
  };
  mintB: {
    programId: PublicKey;
    mint: PublicKey;
    vault: PublicKey;
    decimals: number;
  };

  ammConfig: ClmmConfigInfo;
  observationId: PublicKey;

  creator: PublicKey;
  programId: PublicKey;
  version: 6;

  tickSpacing: number;
  liquidity: BN;
  sqrtPriceX64: BN;
  currentPrice: Decimal;
  tickCurrent: number;
  feeGrowthGlobalX64A: BN;
  feeGrowthGlobalX64B: BN;
  protocolFeesTokenA: BN;
  protocolFeesTokenB: BN;
  swapInAmountTokenA: BN;
  swapOutAmountTokenB: BN;
  swapInAmountTokenB: BN;
  swapOutAmountTokenA: BN;
  tickArrayBitmap: BN[];

  rewardInfos: ClmmPoolRewardInfo[];

  day: {
    volume: number;
    volumeFee: number;
    feeA: number;
    feeB: number;
    feeApr: number;
    rewardApr: {
      A: number;
      B: number;
      C: number;
    };
    apr: number;
    priceMin: number;
    priceMax: number;
  };
  week: {
    volume: number;
    volumeFee: number;
    feeA: number;
    feeB: number;
    feeApr: number;
    rewardApr: {
      A: number;
      B: number;
      C: number;
    };
    apr: number;
    priceMin: number;
    priceMax: number;
  };
  month: {
    volume: number;
    volumeFee: number;
    feeA: number;
    feeB: number;
    feeApr: number;
    rewardApr: {
      A: number;
      B: number;
      C: number;
    };
    apr: number;
    priceMin: number;
    priceMax: number;
  };
  tvl: number;
  lookupTableAccount: PublicKey;

  startTime: number;

  exBitmapInfo: TickArrayBitmapExtensionType;
}

export interface ClmmConfigInfo {
  id: PublicKey;
  index: number;
  protocolFeeRate: number;
  tradeFeeRate: number;
  tickSpacing: number;
  fundFeeRate: number;
  fundOwner: string;
  description: string;
}

export interface TickArrayBitmapExtensionType {
  poolId: PublicKey;
  positiveTickArrayBitmap: BN[][];
  negativeTickArrayBitmap: BN[][];
}

export type Tick = {
  tick: number;
  liquidityNet: BN;
  liquidityGross: BN;
  feeGrowthOutsideX64A: BN;
  feeGrowthOutsideX64B: BN;
  rewardGrowthsOutsideX64: BN[];
};

export type ApiV3Response = {
  id: string;
  success: boolean;
  data: {
    count: number;
    data: PoolInfo[];
    hasNextPage: boolean;
  };
};

export type PoolInfo = {
  type: string;
  programId: string;
  id: string;
  mintA: LpMint;
  mintB: LpMint;
  price: number;
  mintAmountA: number;
  mintAmountB: number;
  feeRate: number;
  openTime: string;
  tvl: number;
  day: Stats;
  week: Stats;
  month: Stats;
  pooltype: string[];
  rewardDefaultInfos: number[];
  farmUpcomingCount: number;
  farmOngoingCount: number;
  farmFinishedCount: number;
  marketId: string;
  lpMint?: LpMint;
  lpPrice: number;
  lpAmount: number;
  burnPercent: number;
  config?: {
    id: string;
    index: number;
    protocolFeeRate: number;
    tradeFeeRate: number;
    tickSpacing: number;
    fundFeeRate: number;
    defaultRange: number;
    defaultRangePoint: number[];
  };
};

export type Stats = {
  volume: number;
  volumeQuote: number;
  volumeFee: number;
  apr: number;
  feeApr: number;
  priceMin: number;
  priceMax: number;
  rewardApr: number[];
};

export type LpMint = {
  chainId: number;
  address: string;
  programId: string;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  tags: string[];
  extensions: Extensions;
};

export type Extensions = object;
