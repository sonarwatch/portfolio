import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';

export type UserCollateralResult = [bigint, bigint];

export type MarketDetail = {
  networkId: EvmNetworkIdType;
  cometAddress: `0x${string}`;
  cometRewardAddress: `0x${string}`;
  baseAssetAddress: `0x${string}`;
  baseAssetDecimals: number;
  assets: {
    address: `0x${string}`;
    decimals: number;
  }[];
};

export type MarketV2Detail = {
  networkId: EvmNetworkIdType;
  address: `0x${string}`;
  name?: string;
  exchangeRate: string;
  underlyings: string[];
  supplyApyFromBlock?: number;
  borrowApyFromBlock?: number;
  supplyApyFromTimestamp?: number;
  borrowApyFromTimestamp?: number;
};
