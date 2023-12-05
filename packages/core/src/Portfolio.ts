import { UsdValue } from './UsdValue';
import { NetworkIdType } from './Network';
import { Yield } from './Yield';
import { AddressSystemType } from './Address';

/**
 * Represents the type of a portfolio asset.
 * @property generic A generic portfolio asset.
 * @property token A token portfolio asset.
 * @property collectible A collectible portfolio asset.
 */
export const PortfolioAssetType = {
  generic: 'generic',
  token: 'token',
  collectible: 'collectible',
} as const;
export type PortfolioAssetTypeType =
  (typeof PortfolioAssetType)[keyof typeof PortfolioAssetType];

/**
 * Represents the label of a portfolio element.
 */
export type PortfolioElementLabel =
  | 'Wallet'
  | 'Staked'
  | 'LiquidityPool'
  | 'Farming'
  | 'Lending'
  | 'Vesting'
  | 'Deposit'
  | 'Rewards'
  | 'Leverage';

/**
 * Represents the type of a portfolio element.
 */
export const PortfolioElementType = {
  single: 'single',
  multiple: 'multiple',
  liquidity: 'liquidity',
  borrowlend: 'borrowlend',
} as const;
export type PortfolioElementTypeType =
  (typeof PortfolioElementType)[keyof typeof PortfolioElementType];

/**
 * Represents the common properties of a portfolio asset.
 * @property networkId The network ID.
 * @property type The type of the portfolio asset.
 * @property value The value of the portfolio asset.
 * @property lockedUntil The timestamp until the portfolio asset is locked.
 */
export type PortfolioAssetCommon = {
  networkId: NetworkIdType;
  type: PortfolioAssetTypeType;
  value: UsdValue;
  lockedUntil?: number;
};

/**
 * Represents the data of a generic portfolio asset.
 * @property name The name of the portfolio asset.
 * @property amount The amount of the portfolio asset.
 */
export type PortfolioAssetGenericData = {
  name?: string;
  amount: number;
};

/**
 * Represents a generic portfolio asset.
 */
export type PortfolioAssetGeneric = PortfolioAssetCommon & {
  type: 'generic';
  data: PortfolioAssetGenericData;
};

/**
 * Represents the data of a token portfolio asset.
 */
export type PortfolioAssetTokenData = {
  address: string;
  amount: number;
  price: UsdValue;
};

/**
 * Represents a token portfolio asset.
 */
export type PortfolioAssetToken = PortfolioAssetCommon & {
  type: 'token';
  data: PortfolioAssetTokenData;
};

/**
 * Represents the data of a collectible portfolio asset.
 */
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

/**
 * Represents a collectible portfolio asset.
 */
export type PortfolioAssetCollectible = PortfolioAssetCommon & {
  type: 'collectible';
  data: PortfolioAssetCollectibleData;
};

/**
 * Represents a portfolio asset.
 */
export type PortfolioAsset =
  | PortfolioAssetGeneric
  | PortfolioAssetToken
  | PortfolioAssetCollectible;

/**
 * Represents the information of a proxy.
 */
export type ProxyInfo = {
  id: string;
  address: string;
};

/**
 * Represents the common properties of a portfolio element.
 * @property networkId The network ID of the portfolio element.
 * @property platformId The platform ID of the portfolio element.
 * @property value The value of the portfolio element.
 * @property type The type of the portfolio element.
 * @property label The label of the portfolio element.
 * @property name The name of the portfolio element.
 * @property tags The tags of the portfolio element.
 * @property proxyInfo The proxy information of the portfolio element.
 */
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

/**
 * Represents the data of a single portfolio element.
 * @property asset The asset of the single portfolio element.
 */
export type PortfolioElementSingleData = {
  asset: PortfolioAsset;
};

/**
 * Represents a single portfolio element.
 */
export type PortfolioElementSingle = PortfolioElementCommon & {
  type: 'single';
  data: PortfolioElementSingleData;
};

/**
 * Represents the data of a multiple portfolio element.
 * @property assets The assets of the multiple portfolio element.
 */
export type PortfolioElementMultipleData = {
  assets: PortfolioAsset[];
};

/**
 * Represents a multiple portfolio element.
 */
export type PortfolioElementMultiple = PortfolioElementCommon & {
  type: 'multiple';
  data: PortfolioElementMultipleData;
};

/**
 * Represents a liquidity.
 */
export type PortfolioLiquidity = {
  assets: PortfolioAsset[];
  assetsValue: UsdValue;
  rewardAssets: PortfolioAsset[];
  rewardAssetsValue: UsdValue;
  value: UsdValue;
  yields: Yield[];
};

/**
 * Represents the data of a liquidity portfolio element.
 */
export type PortfolioElementLiquidityData = {
  liquidities: PortfolioLiquidity[];
};

/**
 * Represents a liquidity portfolio element.
 */
export type PortfolioElementLiquidity = PortfolioElementCommon & {
  type: 'liquidity';
  data: PortfolioElementLiquidityData;
};

/**
 * Represents the data of a borrow lend portfolio element.
 */
export type PortfolioElementBorrowLendData = {
  /**
   * The value of the portfolio element in USD.
   */
  value: UsdValue;
  /**
   * The assets supplied in the portfolio element.
   */
  suppliedAssets: PortfolioAsset[];
  /**
   * The assets borrowed in the portfolio element.
   */
  borrowedAssets: PortfolioAsset[];
  /**
   * The assets rewarded in the portfolio element.
   */
  rewardAssets: PortfolioAsset[];
  /**
   * The value of the assets supplied in USD.
   */
  suppliedValue: UsdValue;
  /**
   * The value of the assets borrowed in USD.
   */
  borrowedValue: UsdValue;
  /**
   * The yields generated by the supplied assets.
   */
  suppliedYields: Yield[][];
  /**
   * The yields generated by the borrowed assets.
   */
  borrowedYields: Yield[][];
  /**
   * The collateral ratio of the portfolio element.
   * -1 means infinity/no borrow.
   * null means unknown.
   * 1.5 means 150%.
   */
  collateralRatio: number | null;
  /**
   * The health ratio of the portfolio element.
   * 1 means 100% / full health / no borrow.
   * 0 and <0 means can be liquidated.
   * null means unknown.
   */
  healthRatio: number | null;
};

/**
 * Represents a borrow lend portfolio element.
 */
export type PortfolioElementBorrowLend = PortfolioElementCommon & {
  type: 'borrowlend';
  data: PortfolioElementBorrowLendData;
};

/**
 * Represents a portfolio element.
 */
export type PortfolioElement =
  | PortfolioElementSingle
  | PortfolioElementMultiple
  | PortfolioElementLiquidity
  | PortfolioElementBorrowLend;

/**
 * Represents the result of a fetcher.
 */
export type FetcherResult = {
  owner: string;
  fetcherId: string;
  networdkId: NetworkIdType;
  duration: number;
  elements: PortfolioElement[];
};

/**
 * Represents the report of a fetcher.
 */
export type FetcherReport = {
  id: string;
  status: 'succeeded' | 'failed';
  duration?: number;
  error?: string;
};

/**
 * Represents the result of multiple fetchers.
 */
export type FetchersResult = {
  date: number;
  owner: string;
  addressSystem: AddressSystemType;
  fetcherReports: FetcherReport[];
  elements: PortfolioElement[];
};
