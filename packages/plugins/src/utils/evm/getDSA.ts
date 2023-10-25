import DSA, { ChainId } from 'dsa-connect';
import { EvmNetworkIdType, networks } from '@sonarwatch/portfolio-core';
import { getEvmWeb3V1Client } from '../clients';

export function getDSA(networkId: EvmNetworkIdType) {
  const network = networks[networkId];
  return new DSA(
    {
      web3: getEvmWeb3V1Client(networkId),
    },
    network.chainId as ChainId
  );
}
