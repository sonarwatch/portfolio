import { UsdValue } from './UsdValue';
import { NetworkIdType } from './Network';
import { Yield } from './Yield';
import { AddressSystemType } from './Address';
import { TokenInfo } from './TokenList';

/**
 * Represents the type of portfolio asset.
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
  | 'Vault'
  | 'Lending'
  | 'Vesting'
  | 'Deposit'
  | 'Rewards'
  | 'Airdrop'
  | 'Margin'
  | 'LimitOrder'
  | 'DCA'
  | 'SmartDCA'
  | 'Leverage';

export type PortfolioAssetAttributes = {
  /**
   * Represents the date (in ms) when the asset will be unlocked.
   * If current date is greater than this value, the asset is unlocked.
   * If set to -1, it means it's locked for an unknown or indeterminate period
   */
  lockedUntil?: number;
  /**
   * Represents if the asset is deprecated.
   */
  isDeprecated?: boolean;
  /**
   * Represents if the asset can be claimed.
   */
  isClaimable?: boolean;
  /**
   * Represents the tags of the asset.
   */
  tags?: string[];
};

/**
 * Represents the type of a portfolio element.
 */
export const PortfolioElementType = {
  multiple: 'multiple',
  liquidity: 'liquidity',
  borrowlend: 'borrowlend',
  leverage: 'leverage',
  trade: 'trade',
} as const;
export type PortfolioElementTypeType =
  (typeof PortfolioElementType)[keyof typeof PortfolioElementType];

/**
 * Represents the common properties of a portfolio asset.
 */
export type PortfolioAssetCommon = {
  networkId: NetworkIdType;
  type: PortfolioAssetTypeType;
  value: UsdValue;
  attributes: PortfolioAssetAttributes;
  name?: string;
  imageUri?: string;
  ref?: string;
  sourceRefs?: SourceRef[];
  link?: string;
};

/**
 * Represents the data of a generic portfolio asset.
 */
export type PortfolioAssetGenericData = {
  address?: string;
  amount?: number;
  price?: UsdValue;
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
  yield?: Yield;
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
  attributes?: CollectibleAttribute[];
  collection?: CollectibleCollection;
};

export type CollectibleCollection = {
  id?: string;
  floorPrice: UsdValue;
  name?: string;
};

export type CollectibleAttribute = {
  trait_type?: string;
  value?: unknown;
  [key: string]: unknown;
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

export type SourceRefName =
  | 'Pool'
  | 'Farm'
  | 'Market'
  | 'Vault'
  | 'Lending Market'
  | 'Strategy'
  | 'NFT Mint'
  | 'Reserve'
  | 'Proposal'
  | 'Distributor'
  | 'Locker'
  | 'Pair';

/**
 * Represents references to on-chain accounts.
 */
export type SourceRef = {
  address: string;
  name: SourceRefName;
};

/**
 * Represents the common properties of a portfolio element.
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
 * Represents the data of a multiple portfolio element.
 */
export type PortfolioElementMultipleData = {
  assets: PortfolioAsset[];
  ref?: string;
  sourceRefs?: SourceRef[];
  link?: string;
};

/**
 * Represents a multiple portfolio element.
 */
export type PortfolioElementMultiple = PortfolioElementCommon & {
  type: 'multiple';
  data: PortfolioElementMultipleData;
};

/**
 * Represents the data of a trade portfolio element.
 */
export type PortfolioElementTradeData = {
  assets: {
    input: PortfolioAsset | null;
    output: PortfolioAsset | null;
  };
  inputAddress: string;
  outputAddress: string;
  initialInputAmount: number;
  withdrawnOutputAmount: number;
  expectedOutputAmount?: number;
  inputPrice: UsdValue;
  outputPrice: UsdValue;
  /**
   * Filled percentage between 0 and 1.
   */
  filledPercentage: number;
  /**
   * Created at timestamp in ms
   */
  createdAt?: number;
  /**
   * Expire at timestamp in ms
   */
  expireAt?: number;

  contract?: string;
  ref?: string;
  sourceRefs?: SourceRef[];
  link?: string;
};

/**
 * Represents a trade portfolio element.
 */
export type PortfolioElementTrade = PortfolioElementCommon & {
  type: 'trade';
  data: PortfolioElementTradeData;
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
  name?: string;

  contract?: string;
  ref?: string;
  sourceRefs?: SourceRef[];
  link?: string;
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

export enum LeverageSide {
  long = 'long',
  short = 'short',
}

export type IsoLevPosition = {
  /**
   * Address of the levareged asset if it exist
   */
  address?: string;
  name?: string;
  imageUri?: string;
  collateralValue: UsdValue;
  side: LeverageSide;
  entryPrice: UsdValue;
  markPrice: UsdValue;
  size: number;
  sizeValue: UsdValue;
  pnlValue: UsdValue;
  liquidationPrice: UsdValue;
  leverage?: number;
  tp?: number;
  sl?: number;
  value: UsdValue;
  ref?: string;
  sourceRefs?: SourceRef[];
};

export type CrossLevPosition = Omit<IsoLevPosition, 'collateralValue'>;

/**
 * Represents the data of a leverage portfolio element.
 */
export type PortfolioElementLeverageData = {
  /**
   * Isolated positions
   */
  isolated?: {
    positions: IsoLevPosition[];
    value: UsdValue;
  };
  /**
   * Cross positions
   */
  cross?: {
    /**
     * Sum of positions sizeValue / cross value
     */
    leverage?: number;
    /**
     * If it reach 1, positions will be liquidated
     */
    collateralAssets?: PortfolioAsset[];
    collateralValue: UsdValue;
    positions: CrossLevPosition[];
    value: UsdValue;
  };
  /**
   * Total value (total equity)
   */
  value: UsdValue;

  contract?: string;
  ref?: string;
  sourceRefs?: SourceRef[];
  link?: string;
};

/**
 * Represents a leverage portfolio element.
 */
export type PortfolioElementLeverage = PortfolioElementCommon & {
  type: 'leverage';
  data: PortfolioElementLeverageData;
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
   * The unsettled part of the portfolio element.
   */
  unsettled?: {
    /**
     * The unsettled assets.
     */
    assets: PortfolioAssetGeneric[];
    /**
     * The unsettled value.
     */
    value: UsdValue;
  };

  /**
   * The value of the assets supplied in USD.
   */
  suppliedValue: UsdValue;

  /**
   * The value of the assets borrowed in USD.
   */
  borrowedValue: UsdValue;

  /**
   * The value of the reward assets in USD.
   */
  rewardValue: UsdValue;

  /**
   * The yields generated by the supplied assets.
   */
  suppliedYields: Yield[][];

  /**
   * The yields generated by the borrowed assets.
   */
  borrowedYields: Yield[][];

  /**
   * The health ratio of the portfolio element.
   * 1 means full health or no borrow.
   * 0 or below means can be liquidated.
   * null means unknown.
   */
  healthRatio: number | null;

  /**
   * Represents the date (in ms) when the loan will expire.
   * If current date is greater than this value, the loan is expired.
   * undefined means the loan has no expiration.
   */
  expireOn?: number;

  contract?: string;
  ref?: string;
  sourceRefs?: SourceRef[];
  link?: string;
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
  | PortfolioElementMultiple
  | PortfolioElementLiquidity
  | PortfolioElementLeverage
  | PortfolioElementBorrowLend
  | PortfolioElementTrade;

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
  value: UsdValue;
  elements: PortfolioElement[];
  duration: number;
  tokenInfo?: Partial<Record<NetworkIdType, Record<string, TokenInfo>>>;
};
