import {
  EvmNetworkIdType,
  NetworkIdType,
  RpcEndpoint,
} from '@sonarwatch/portfolio-core';
import { Chain, avalanche, mainnet, polygon } from 'viem/chains';
import urlToRpcEndpoint from './urlToRpcEndpoint';

export const viemChainsByNetworkId: Record<EvmNetworkIdType, Chain> = {
  ethereum: mainnet,
  avalanche,
  polygon,
};

export function getUrlEndpoints(): Record<NetworkIdType, string> {
  return {
    sei: process.env['PORTFOLIO_SEI_RPC'] || 'https://sei-rest.brocha.in/',
    bitcoin:
      process.env['PORTFOLIO_BITCOIN_RPC'] || 'https://blockstream.info/api/',
    solana:
      process.env['PORTFOLIO_SOLANA_RPC'] ||
      'https://api.mainnet-beta.solana.com',
    ethereum:
      process.env['PORTFOLIO_ETHEREUM_RPC'] ||
      'https://eth-mainnet.g.alchemy.com/v2',
    avalanche:
      process.env['PORTFOLIO_AVALANCHE_RPC'] ||
      'https://api.avax.network/ext/bc/C/rpc',
    polygon:
      process.env['PORTFOLIO_POLYGON_RPC'] || 'https://polygon.llamarpc.com',
    aptos:
      process.env['PORTFOLIO_APTOS_RPC'] ||
      'https://fullnode.mainnet.aptoslabs.com',
    sui:
      process.env['PORTFOLIO_SUI_RPC'] ||
      'https://sui-mainnet-rpc-germany.allthatnode.com',
  };
}

export function getUrlEndpoint(networkId: NetworkIdType): string {
  return getUrlEndpoints()[networkId];
}

export function getRpcEndpoints(): Record<NetworkIdType, RpcEndpoint> {
  const urlEndpoints = getUrlEndpoints();
  return Object.fromEntries(
    Object.entries(urlEndpoints).map(([key, value]) => [
      key,
      urlToRpcEndpoint(value),
    ])
  ) as Record<NetworkIdType, RpcEndpoint>;
}

export function getRpcEndpoint(networkId: NetworkIdType): RpcEndpoint {
  return getRpcEndpoints()[networkId];
}
