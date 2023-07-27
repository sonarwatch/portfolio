import { AddressSystemType } from './Address';

export const NetworkId = {
  bitcoin: 'bitcoin',
  solana: 'solana',
  ethereum: 'ethereum',
  avalanche: 'avalanche',
  aptos: 'aptos',
  sui: 'sui',
} as const;

export type NetworkIdType = (typeof NetworkId)[keyof typeof NetworkId];
export type MoveNetworkIdType = typeof NetworkId.aptos | typeof NetworkId.sui;
export type EvmNetworkIdType =
  | typeof NetworkId.ethereum
  | typeof NetworkId.avalanche;

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
  coingeckoPlatformId: string;
  tokenListUrl: string;
  description?: string;
  website?: string;
  image?: string;
  discord?: string;
  twitter?: string;
  medium?: string;
};
