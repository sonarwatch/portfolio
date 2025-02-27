export type CollectionResponse = {
  collections: Collection[];
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
