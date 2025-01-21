export type DisplayOptions = {
  showNativeBalance?: boolean;
  showFungible?: boolean;
  showInscription?: boolean;
  showUnverifiedCollections?: boolean;
  showCollectionMetadata?: boolean;
  showGrandTotal?: boolean;
};
export type GetAssetsByOwnerDasParams = DisplayOptions & {
  limit?: number;
};
export type GetAssetsByOwnerOutput = {
  jsonrpc: string;
  result: HeliusAssetList;
  id: string;
};
export type GetAssetBatchOutput = {
  jsonrpc: string;
  result: HeliusAsset[];
  id: string;
};

export type HeliusAssetList = {
  total: number;
  limit: number;
  page: number;
  items: HeliusAsset[];
};

export type HeliusAsset = {
  interface: string;
  id: string;
  content: Content;
  authorities: Authority[];
  compression: Compression;
  grouping: Grouping[];
  royalty: Royalty;
  creators: Creator[];
  ownership: Ownership;
  supply: Supply | null;
  mutable: boolean;
  burnt: boolean;
  token_info?: TokenInfo;
  inscription: Inscription | null;
  spl20: Spl20 | null;
};

export type HeliusFungibleAsset = HeliusAsset & {
  interface: 'FungibleToken' | 'FungibleAsset';
  token_info: TokenInfo;
};

export type TokenInfo = {
  balance: number;
  supply: number;
  decimals: number;
  token_program: string;
  associated_token_address: string;
  symbol?: string;
  price_info?: PriceInfo;
};

export type PriceInfo = {
  price_per_token: number;
  total_price: number;
  currency: string;
};

export type Inscription = {
  order: number;
  size: number;
  contentType: string;
  encoding: string;
  validationHash: string;
  inscriptionDataAccount: string;
};
export type Spl20 = {
  p: string;
  op: string;
  tick: string;
  max?: string;
  lim?: string;
  amt?: string;
};

export type Authority = {
  address: string;
  scopes: string[];
};

export type Compression = {
  eligible: boolean;
  compressed: boolean;
  data_hash: string;
  creator_hash: string;
  asset_hash: string;
  tree: string;
  seq: number;
  leaf_id: number;
};

export type Content = {
  $schema: string;
  json_uri: string;
  files: File[];
  metadata: Metadata;
  links?: Links;
};

export type File = {
  uri: string;
  cdn_uri?: string;
  mime?: string;
};

export type Links = {
  external_url?: string;
  image?: string;
};

export type Metadata = {
  attributes?: Attribute[];
  description?: string;
  name: string;
  symbol: string;
};

export type Attribute = {
  value: string;
  trait_type: string;
};

export type Creator = {
  address: string;
  share: number;
  verified: boolean;
};

export type Grouping = {
  group_key: string;
  group_value: string;
};

export type CollectionGroup = {
  group_key: 'collection';
  group_value: string;
  verified: boolean;
  collection_metadata?: CollectionMetadata;
};

export interface CollectionMetadata {
  name: string;
  symbol: string;
  image: string;
  description: string;
  external_url: string;
}

export type Ownership = {
  frozen: boolean;
  delegated: boolean;
  delegate: null | string;
  ownership_model: string;
  owner: string;
};

export type Royalty = {
  royalty_model: string;
  target: null;
  percent: number;
  basis_points: number;
  primary_sale_happened: boolean;
  locked: boolean;
};

export type Supply = {
  print_max_supply: number;
  print_current_supply: number;
  edition_nonce: number | null;
};
