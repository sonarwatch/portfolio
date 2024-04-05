import { AddressSystemType } from './Address';

/**
 * Network IDs.
 */
export const NetworkId = {
  bitcoin: 'bitcoin',
  solana: 'solana',
  ethereum: 'ethereum',
  avalanche: 'avalanche',
  polygon: 'polygon',
  aptos: 'aptos',
  sui: 'sui',
  sei: 'sei',
  bnb: 'bnb',
} as const;

/**
 * Represents the type of a network ID.
 */
export type NetworkIdType = (typeof NetworkId)[keyof typeof NetworkId];

/**
 * Represents the type of a Move network ID.
 */
export type MoveNetworkIdType = typeof NetworkId.aptos | typeof NetworkId.sui;

/**
 * Represents the type of an EVM network ID.
 */
export type EvmNetworkIdType =
  | typeof NetworkId.ethereum
  | typeof NetworkId.avalanche
  | typeof NetworkId.polygon
  | typeof NetworkId.bnb;

/**
 * Represents the type of a Cosmos network ID.
 */
export type CosmosNetworkIdType = typeof NetworkId.sei;

/**
 * Represents a network.
 */
export type Network = {
  id: NetworkIdType;
  name: string;
  addressSystem: AddressSystemType;
  chainId: number;
  native: {
    address: string;
    decimals: number;
    coingeckoId: string;
  };
  nativeWrapped: {
    address: string;
    decimals: number;
    coingeckoId: string;
  } | null;
  isLive: boolean;
  geckoId: string;
  llamaId: string;
  tokenListUrl: string;
  description?: string;
  website?: string;
  image?: string;
  discord?: string;
  twitter?: string;
  medium?: string;
};
