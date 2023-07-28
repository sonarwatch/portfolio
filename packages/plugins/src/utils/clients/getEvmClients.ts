import { PublicClient } from 'viem';
import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import getEvmClient from './getEvmClient';

export default function getEvmClients(): Record<
  EvmNetworkIdType,
  PublicClient
> {
  return {
    avalanche: getEvmClient(NetworkId.avalanche),
    ethereum: getEvmClient(NetworkId.ethereum),
    polygon: getEvmClient(NetworkId.polygon),
  };
}
