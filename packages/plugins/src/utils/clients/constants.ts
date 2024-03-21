import {
  EvmNetworkIdType,
  NetworkIdType,
  RpcEndpoint,
} from '@sonarwatch/portfolio-core';
import { Chain, avalanche, mainnet, polygon, bsc } from 'viem/chains';
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

export function getRpcEndpoint(networkId: NetworkIdType): RpcEndpoint {
  return getRpcEndpoints()[networkId];
}
