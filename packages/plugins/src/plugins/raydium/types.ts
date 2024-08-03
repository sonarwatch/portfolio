import { GetProgramAccountsFilter, PublicKey } from '@solana/web3.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import { TokenPrice, Yield } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
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
