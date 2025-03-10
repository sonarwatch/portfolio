import {
  CrossLevPosition,
  IsoLevPosition,
  PortfolioAssetAttributes,
  PortfolioElementLabel,
  PortfolioElementTypeType,
  SourceRef,
  UsdValue,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export type Params = {
  type: PortfolioElementTypeType;
  label: PortfolioElementLabel;
  name?: string;
  tags?: string[];
  platformId?: string;
  contract?: string;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};

export type LiquidityParams = {
  name?: string;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};

export type ConcentratedLiquidityParams = {
  addressA: string | PublicKey;
  addressB: string | PublicKey;
  liquidity: number | BigNumber | string;
  tickCurrentIndex: number | BigNumber | string;
  tickLowerIndex: number | BigNumber | string;
  tickUpperIndex: number | BigNumber | string;
  currentSqrtPrice?: number | BigNumber | string;
  poolLiquidity?: number | BigNumber | string;
  feeRate?: number | BigNumber | string; // 0.01 for 1%
  swapVolume24h?: number | BigNumber | string; // in $
  roundUp?: boolean;
  name?: string;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};

export type PortfolioAssetGenericParams = {
  address?: string | PublicKey;
  amount?: number | BigNumber | string;
  price?: number | BigNumber;
  attributes?: PortfolioAssetAttributes;
  value?: number | BigNumber;
  name?: string;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};

export type PortfolioAssetCollectibleParams = {
  address: string | PublicKey;
  amount?: number | BigNumber | string;
  collection: {
    name: string;
    floorPrice: number | BigNumber | string; // in $, already shifted
    imageUri?: string;
  };
  attributes?: PortfolioAssetAttributes;
  name?: string;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};

export type PortfolioAssetTokenParams = {
  address: string | PublicKey;
  amount: number | BigNumber | string;
  attributes?: PortfolioAssetAttributes;
  alreadyShifted?: boolean;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};

export type TradeParams = {
  inputAsset: Omit<PortfolioAssetTokenParams, 'amount'> & {
    amount?: number | BigNumber | string;
  };
  outputAsset: Omit<PortfolioAssetTokenParams, 'amount'> & {
    amount?: number | BigNumber | string;
  };

  initialInputAmount: number | BigNumber | string;
  expectedOutputAmount?: number | BigNumber | string;
  withdrawnOutputAmount: number | BigNumber | string;
  createdAt?: number;
  expireAt?: number;
};

export type IsoLevPositionParams = Omit<IsoLevPosition, 'value'> & {
  value?: UsdValue;
};

export type CrossLevPositionParams = CrossLevPosition;
