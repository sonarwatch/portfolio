import { PublicKey } from '@solana/web3.js';

export enum PriceStatus {
  Unknown,
  Trading,
  Halted,
  Auction,
  Ignored,
}

export enum CorpAction {
  NoCorpAct,
}

export enum PriceType {
  Unknown,
  Price,
}

export enum DeriveType {
  Unknown,
  Volatility,
}

export enum AccountType {
  Unknown,
  Mapping,
  Product,
  Price,
  Test,
  Permission,
}

export type Base = {
  magic: number;
  version: number;
  type: AccountType;
  size: number;
};

export type MappingData = Base & {
  nextMappingAccount: PublicKey | null;
  productAccountKeys: PublicKey[];
};

export type Product = {
  [index: string]: string;
};

export type ProductData = Base & {
  priceAccountKey: PublicKey | null;
  product: Product;
};

export type Price = {
  priceComponent: bigint;
  price: number;
  confidenceComponent: bigint;
  confidence: number;
  status: PriceStatus;
  corporateAction: CorpAction;
  publishSlot: number;
};

export type PriceComponent = {
  publisher: PublicKey;
  aggregate: Price;
  latest: Price;
};

export type Ema = {
  valueComponent: bigint;
  value: number;
  numerator: bigint;
  denominator: bigint;
};

export type PriceData = Base & {
  priceType: PriceType;
  exponent: number;
  numComponentPrices: number;
  numQuoters: number;
  lastSlot: bigint;
  validSlot: bigint;
  emaPrice: Ema;
  emaConfidence: Ema;
  timestamp: bigint;
  minPublishers: number;
  drv2: number;
  drv3: number;
  drv4: number;
  productAccountKey: PublicKey;
  nextPriceAccountKey: PublicKey | null;
  previousSlot: bigint;
  previousPriceComponent: bigint;
  previousPrice: number;
  previousConfidenceComponent: bigint;
  previousConfidence: number;
  previousTimestamp: bigint;
  priceComponents: PriceComponent[];
  aggregate: Price;
  // The current price and confidence and status. The typical use of this type is= to consume these three fields.
  // If undefined, Pyth does not currently have price information for this product. This condition can
  // happen for various reasons (e.g., US equity market is closed, or insufficient publishers), and your
  // application should handle it gracefully. Note that other raw price information fields (such as
  // aggregate.price) may be defined even if this is undefined; you most likely should not use those fields,
  // as their value can be arbitrary when this is undefined.
  price: number | undefined;
  confidence: number | undefined;
  status: PriceStatus;
};

export type PermissionData = Base & {
  masterAuthority: PublicKey;
  dataCurationAuthority: PublicKey;
  securityAuthority: PublicKey;
};
