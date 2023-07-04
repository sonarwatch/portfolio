import {
  EvmNetworkIdType,
  NetworkIdType,
  RpcEndpoint,
} from '@sonarwatch/portfolio-core';
import { Chain, avalanche, mainnet } from 'viem/chains';
import urlToRpcEndpoint from './urlToRpcEndpoint';

export const viemChainsByNetworkId: Record<EvmNetworkIdType, Chain> = {
  ethereum: mainnet,
  avalanche,
};

const urlEndpoints: Record<NetworkIdType, string> = {
  bitcoin: process.env['BITCOIN_RPC'] || 'https://blockstream.info/api/',
  solana: process.env['SOLANA_RPC'] || 'https://api.mainnet-beta.solana.com',
  ethereum:
    process.env['ETHEREUM_RPC'] || 'https://eth-mainnet.g.alchemy.com/v2',
  avalanche:
    process.env['AVALANCHE_RPC'] || 'https://api.avax.network/ext/bc/C/rpc',
  aptos: process.env['APTOS_RPC'] || 'https://fullnode.mainnet.aptoslabs.com',
  sui:
    process.env['SUI_RPC'] || 'https://sui-mainnet-rpc-germany.allthatnode.com',
};

export const rpcEnpoints: Record<NetworkIdType, RpcEndpoint> =
  Object.fromEntries(
    Object.entries(urlEndpoints).map(([key, value]) => [
      key,
      urlToRpcEndpoint(value),
    ])
  ) as Record<NetworkIdType, RpcEndpoint>;
