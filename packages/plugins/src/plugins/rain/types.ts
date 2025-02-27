import { PoolStatus } from './structs/pool';

export type PoolResponse = {
  pubkey: string;
  pool: Pool;
};

export type CollectionResponse = {
  collections: Collection[];
};

export type Pool = {
  owner: string;
  currency: string;
  oraclePoolUsd: string;
  oracleSolUsd: string;
  status: PoolStatus;
  isCompounded: boolean;
  isShared: boolean;
  totalAmount: string;
  borrowedAmount: string;
  availableAmount: string;
  usableAmount: string;
  loanCurve: Curve;
  mortgageCurve: Curve;
  isMortgageEnabled: boolean;
  nftLocked: string;
  totalLiquidations: string;
  totalLoans: string;
  totalMortgages: string;
  totalInterest: string;
  depositedAt: string;
  createdAt: string;
  updatedAt: string;
  collectionsUpdatedAt: string;
  lastLoanAt: string;
  lastMortgageAt: string;
  conditions: PoolCondition;
  liquidation: PoolLiquidation;
  whitelist: string;
  padding: string[];
  collections: PoolCollection[];
};

export type PoolCollection = {
  collection: string;
  collectionLtv: number;
  exposure: number;
  amountUsed: string;
};

export type PoolLiquidation = {
  loanLiquidation: number;
  mortgageLiquidation: number;
  isAutoSellEnabled: boolean;
  percentageMaxLoss: number;
};

export type PoolCondition = {
  isEnabled: boolean;
  minAge: string;
  minLoan: string;
  minVolume: number;
  liquidationThreshold: number;
  padding1: number;
  padding2: number;
  padding3: number;
};

export type Curve = {
  baseInterest: number;
  interestRate: number;
  curveRate: number;
  curveRateDay: number;
  maxDuration: string;
  maxAmount: string;
};

export type Collection = {
  collectionId: number;
  name: string;
  whitelistType: {
    __t: 'CreatorWhitelist' | 'CollectionWhitelist';
    pubkey: string;
  };
  floorPrice: string;
  supply: string;
  currentLoan: string;
  maxLoan: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  pubkey: string;
  metadata: {
    tensorSlug: string;
    collectionName: string;
    collectionNameMe: string;
    collectionNameTensor: string;
    banner: string;
    thumbnail: string;
    lookupTable: string;
    isMortgageEnabled: boolean;
    url: string;
    magicEdenSlug: string;
  };
};

export type PickedCollection = Pick<
  Collection,
  'collectionId' | 'name' | 'floorPrice'
>;

export type LoansResponse = {
  user: string;
  platform: string;
  limit: number;
  offset: number;
  isAdmin: number;
  totalCount: number;
  ongoingCount: number;
  loans: Loan[];
};

export type Loan = {
  pubkey: string;
  kind: string;
  status: string;
  borrower: string;
  lender: string;
  pool: string;
  mint: string;
  currency: string;
  isCustom: boolean;
  isFrozen: boolean;
  isCompressedLoan: boolean;
  isDefi: boolean;
  collateralAmount: string;
  collateralDecimals: number;
  price: string;
  interest: string;
  amount: string;
  duration: string;
  collectionId: number;
  liquidation: number;
  marketplace: string;
  sale: Sale;
  listing: Listing;
  createdAt: Date;
  expiredAt: Date;
  repaidAt: Date;
  soldAt: Date;
  liquidatedAt: Date;
  updatedAt: Date;
  deletedAt: null;
  version: number;
  amountUsd: string;
};

export type Listing = {
  isListed: boolean;
  price: string;
  _id: string;
};

export type Sale = {
  isForSale: boolean;
  salePrice: string;
  currency: string;
  _id: string;
};
