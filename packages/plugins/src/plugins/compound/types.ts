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
