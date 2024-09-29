import { GetProgramAccountsFilter, PublicKey } from '@solana/web3.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { TokenPrice, Yield } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
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

export type FarmConfig = {
  programId: PublicKey;
  version: string;
  d: number;
  filters: GetProgramAccountsFilter[];
  struct: BeetStruct<FarmAccount, Partial<FarmAccount>>;
};

export type FarmInfo = {
  account: ParsedAccount<FarmAccount>;
  lpToken: TokenPrice;
  d: number;
  rewardTokenA?: TokenPrice;
  rewardTokenB?: TokenPrice;
  yields?: Yield[];
};

export type FarmInfoV6 = {
  account: FarmAccountV6;
  lpToken: TokenPrice;
  multiplier: BigNumber;
  rewardTokens: (TokenPrice | undefined)[];
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
