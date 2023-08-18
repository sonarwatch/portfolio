import { AmmInfoV4, AmmInfoV5 } from './structs/amms';

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
