import { UsdValue } from './UsdValue';
import { NetworkIdType } from './Network';
import { Yield } from './Yield';
import { AddressSystemType } from './Address';

export const PortfolioAssetType = {
  generic: 'generic',
  token: 'token',
  collectible: 'collectible',
} as const;
export type PortfolioAssetTypeType =
  (typeof PortfolioAssetType)[keyof typeof PortfolioAssetType];

export type PortfolioElementLabel =
  | 'Wallet'
  | 'Staked'
  | 'LiquidityPool'
  | 'Farming'
  | 'Lending'
  | 'Vesting'
  | 'Deposit'
  | 'Rewards';

export const PortfolioElementType = {
  single: 'single',
  multiple: 'multiple',
  liquidity: 'liquidity',
  borrowlend: 'borrowlend',
} as const;
export type PortfolioElementTypeType =
  (typeof PortfolioElementType)[keyof typeof PortfolioElementType];

export type PortfolioAssetCommon = {
  networkId: NetworkIdType;
  type: PortfolioAssetTypeType;
  value: UsdValue;
};

export type PortfolioAssetGenericData = {
  name?: string;
  amount: number;
};
export type PortfolioAssetGeneric = PortfolioAssetCommon & {
  type: 'generic';
  data: PortfolioAssetGenericData;
};

export type PortfolioAssetTokenData = {
  address: string;
  amount: number;
  price: UsdValue;
};
export type PortfolioAssetToken = PortfolioAssetCommon & {
  type: 'token';
  data: PortfolioAssetTokenData;
};

export type PortfolioAssetCollectibleData = {
  address: string;
  amount: number;
  price: UsdValue;
  name?: string;
  description?: string;
  imageUri?: string;
  dataUri?: string;
  collection?: {
    id: string;
    floorPrice: UsdValue;
    name?: string;
  };
};
export type PortfolioAssetCollectible = PortfolioAssetCommon & {
  type: 'collectible';
  data: PortfolioAssetCollectibleData;
};

export type PortfolioAsset =
  | PortfolioAssetGeneric
  | PortfolioAssetToken
  | PortfolioAssetCollectible;

export type ProxyInfo = {
  id: string;
  address: string;
};

export type PortfolioElementCommon = {
  networkId: NetworkIdType;
  platformId: string;
  value: UsdValue;
  type: PortfolioElementTypeType;
  label: PortfolioElementLabel;
  name?: string;
  tags?: string[];
  proxyInfo?: ProxyInfo;
};

export type PortfolioElementSingleData = {
  asset: PortfolioAsset;
};

export type PortfolioElementSingle = PortfolioElementCommon & {
  type: 'single';
  data: PortfolioElementSingleData;
};

export type PortfolioElementMultipleData = {
  assets: PortfolioAsset[];
};

export type PortfolioElementMultiple = PortfolioElementCommon & {
  type: 'multiple';
  data: PortfolioElementMultipleData;
};

export type PortfolioLiquidity = {
  assets: PortfolioAsset[];
  assetsValue: UsdValue;
  rewardAssets: PortfolioAsset[];
  rewardAssetsValue: UsdValue;
  value: UsdValue;
  yields: Yield[];
};

export type PortfolioElementLiquidityData = {
  liquidities: PortfolioLiquidity[];
};

export type PortfolioElementLiquidity = PortfolioElementCommon & {
  type: 'liquidity';
  data: PortfolioElementLiquidityData;
};

export type PortfolioElementBorrowLendData = {
  value: UsdValue;
  suppliedAssets: PortfolioAsset[];
  borrowedAssets: PortfolioAsset[];
  rewardAssets: PortfolioAsset[];
  suppliedValue: UsdValue;
  borrowedValue: UsdValue;
  suppliedYields: Yield[][];
  borrowedYields: Yield[][];

  // -1 means infinity/no borrow
  // null means unknown
  // 1.5 means 150%
  collateralRatio: number | null;
  healthRatio: number | null;
};

export type PortfolioElementBorrowLend = PortfolioElementCommon & {
  type: 'borrowlend';
  data: PortfolioElementBorrowLendData;
};

export type PortfolioElement =
  | PortfolioElementSingle
  | PortfolioElementMultiple
  | PortfolioElementLiquidity
  | PortfolioElementBorrowLend;

export type FetcherResult = {
  owner: string;
  fetcherId: string;
  networdkId: NetworkIdType;
  duration: number;
  elements: PortfolioElement[];
};

export type FetcherReport = {
  id: string;
  status: 'succeeded' | 'failed';
  duration?: number;
  error?: string;
};

export type FetchersResult = {
  date: number;
  owner: string;
  addressSystem: AddressSystemType;
  fetcherReports: FetcherReport[];
  elements: PortfolioElement[];
};
