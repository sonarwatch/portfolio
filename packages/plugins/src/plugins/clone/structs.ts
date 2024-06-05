import {
  BeetStruct,
  FixableBeetStruct,
  array,
  u16,
  u8,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { blob, i64, u64 } from '../../utils/solana';

export type Borrow = {
  poolIndex: number;
  borrowedOnasset: BigNumber;
  collateralAmount: BigNumber;
};

export const borrowStruct = new BeetStruct<Borrow>(
  [
    ['poolIndex', u8],
    ['borrowedOnasset', u64],
    ['collateralAmount', u64],
  ],
  (args) => args as Borrow
);

export type LiquidityPosition = {
  poolIndex: number;
  committedCollateralLiquidity: BigNumber;
  collateralIldRebate: BigNumber;
  onassetIldRebate: BigNumber;
};

export const liquidityPositionStruct = new BeetStruct<LiquidityPosition>(
  [
    ['poolIndex', u8],
    ['committedCollateralLiquidity', u64],
    ['collateralIldRebate', i64],
    ['onassetIldRebate', i64],
  ],
  (args) => args as LiquidityPosition
);

export type Comet = {
  collateralAmount: BigNumber;
  positions: LiquidityPosition[];
};

export const CometStruct = new FixableBeetStruct<Comet>(
  [
    ['collateralAmount', u64],
    ['positions', array(liquidityPositionStruct)],
  ],
  (args) => args as Comet
);

export type User = {
  buffer: Buffer;
  borrows: Borrow[];
  comet: Comet;
};

export const userStruct = new FixableBeetStruct<User>(
  [
    ['buffer', blob(8)],
    ['borrows', array(borrowStruct)],
    ['comet', CometStruct],
  ],
  (args) => args as User
);

export enum Status {
  Active,
  Frozen,
  Extraction,
  Liquidation,
  Deprecation,
}

export type AssetInfo = {
  onassetMint: PublicKey;
  oracleInfoIndex: number;
  ilHealthScoreCoefficient: number;
  positionHealthScoreCoefficient: number;
  minOvercollateralRatio: number;
  maxLiquidationOvercollateralRatio: number;
};

export const assetInfoStruct = new BeetStruct<AssetInfo>(
  [
    ['onassetMint', publicKey],
    ['oracleInfoIndex', u8],
    ['ilHealthScoreCoefficient', u16],
    ['positionHealthScoreCoefficient', u16],
    ['minOvercollateralRatio', u16],
    ['maxLiquidationOvercollateralRatio', u16],
  ],
  (args) => args as AssetInfo
);

export type Pool = {
  underlyingAssetTokenAccount: PublicKey;
  committedCollateralLiquidity: BigNumber;
  collateralIld: BigNumber;
  onassetIld: BigNumber;
  treasuryTradingFeeBps: number;
  liquidityTradingFeeBps: number;
  assetInfo: AssetInfo;
  status: Status;
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['underlyingAssetTokenAccount', publicKey],
    ['committedCollateralLiquidity', u64],
    ['collateralIld', i64],
    ['onassetIld', i64],
    ['treasuryTradingFeeBps', u16],
    ['liquidityTradingFeeBps', u16],
    ['assetInfo', assetInfoStruct],
    ['status', u8],
  ],
  (args) => args as Pool
);

export type Pools = {
  buffer: Buffer;
  pools: Pool[];
};

export const PoolsStruct = new FixableBeetStruct<Pools>(
  [
    ['buffer', blob(8)],
    ['pools', array(poolStruct)],
  ],
  (args) => args as Pools
);
