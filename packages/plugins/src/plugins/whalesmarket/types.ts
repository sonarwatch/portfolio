export type TokensResponse = {
  messages: string;
  data: Data;
  status_code: number;
};

export type Data = {
  count: number;
  list: Token[];
};

export type Token = {
  id: string;
  created_at: Date;
  address: null | string;
  settle_time: number | null;
  settle_duration: number | null;
  pledge_rate: number | null;
  status: ListStatus;
  symbol: string;
  name: string;
  icon: string;
  price: number | null;
  last_price: number;
  coin_gecko_id: null | string;
  decimals: number | null;
  type: Type;
  token_id: null | string;
  category: Category;
  price_change: PriceChange;
  volume: Volume;
  volume_change: VolumeChange;
  settle_type: SettleType;
  chain_id: number;
  network_icon: string;
  network_name: string;
  network_url: string;
  website: null | string;
  twitter: null | string;
  start_time: number | null;
  banner_url: null | string;
  priority: number | null;
  metadata: Metadata | null;
  unit: Unit | null;
  settle_rate: number | null;
  total_volume: number;
};

export enum Category {
  PointMarket = 'point_market',
  PreMarket = 'pre_market',
  RuneMarket = 'rune_market',
}

export type Metadata = {
  title: string;
  description: string;
  background_image: string;
  cta: Cta;
  icon?: string;
  status?: MetadataStatus;
  priority?: number;
};

export type Cta = {
  text: string;
  url: string;
};

export enum MetadataStatus {
  Inactive = 'inactive',
}

export type PriceChange = {
  h24: number;
};

export enum SettleType {
  Manual = 'manual',
  System = 'system',
}

export enum ListStatus {
  Active = 'active',
  Draft = 'draft',
  Ended = 'ended',
  Settling = 'settling',
}

export enum Type {
  Currency = 'currency',
  PreMarket = 'pre_market',
}

export type Unit = {
  prefix_icon: PrefixIcon;
  icon: string;
  symbol: symbol;
};

export enum PrefixIcon {
  Diamonds = 'Diamonds',
  Empty = '',
  Pearl = 'Pearl',
  Shards = 'Shards',
}

export enum Symbol {
  Diamond = 'Diamond',
  Empty = '',
  EzPoint = 'ezPoint',
  Mile = 'Mile',
  Pearl = 'Pearl',
  Score = 'Score',
  Shard = 'Shard',
}

export type Volume = {
  h24: number;
  total_vol?: number;
};

export type VolumeChange = {
  h24: number;
  total_vol_day30?: number;
};
