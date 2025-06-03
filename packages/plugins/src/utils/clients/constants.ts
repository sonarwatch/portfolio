import {
  ClientType,
  EvmNetworkIdType,
  NetworkIdType,
  RpcEndpoint,
} from '@sonarwatch/portfolio-core';
import { avalanche, bsc, Chain, mainnet, polygon } from 'viem/chains';
import urlToRpcEndpoint from './urlToRpcEndpoint';

export const viemChainsByNetworkId: Record<EvmNetworkIdType, Chain> = {
  ethereum: mainnet,
  avalanche,
  polygon,
  bnb: bsc,
};

export function getUrlEndpoints(): Record<NetworkIdType, string> {
  return {
    sei: process.env['PORTFOLIO_SEI_RPC'] || 'https://sei-rpc.polkachu.com/',
    bitcoin:
      process.env['PORTFOLIO_BITCOIN_RPC'] || 'https://blockstream.info/api/',
    bnb: process.env['PORTFOLIO_BNB_RPC'] || 'https://binance.llamarpc.com',
    solana:
      process.env['PORTFOLIO_SOLANA_RPC'] ||
      'https://api.mainnet-beta.solana.com',
    ethereum:
      process.env['PORTFOLIO_ETHEREUM_RPC'] || 'https://eth.llamarpc.com',
    avalanche:
      process.env['PORTFOLIO_AVALANCHE_RPC'] ||
      'https://api.avax.network/ext/bc/C/rpc',
    polygon: process.env['PORTFOLIO_POLYGON_RPC'] || 'https://1rpc.io/matic',
    aptos:
      process.env['PORTFOLIO_APTOS_RPC'] ||
      'https://api.mainnet.aptoslabs.com/v1',
    sui: process.env['PORTFOLIO_SUI_RPC'] || 'https://sui-rpc.publicnode.com',
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

const endpointIndices: Partial<Record<NetworkIdType, number>> = {};
const fallBackEndpointIndices: Partial<Record<NetworkIdType, number>> = {};

export function getRpcEndpoint(
  networkId: NetworkIdType,
  clientType?: ClientType
): RpcEndpoint {
  let endpoint;
  let indices;
  if (clientType === ClientType.FAST_LIMITED) {
    endpoint = { url: process.env['PORTFOLIO_SOLANA_FAST_LIMITED_RPC']! };
    indices = fallBackEndpointIndices;
  } else {
    endpoint = getRpcEndpoints()[networkId];
    indices = endpointIndices;
  }

  if (!endpoint.url.includes(',')) {
    return endpoint;
  }

  if (indices[networkId] === undefined) {
    indices[networkId] = 0;
  }

  const index = indices[networkId]!;
  const endpoints = endpoint.url.split(',');
  const selectedUrl = endpoints[index];
  indices[networkId] = (index + 1) % endpoints.length;

  return {
    url: selectedUrl,
  };
}
