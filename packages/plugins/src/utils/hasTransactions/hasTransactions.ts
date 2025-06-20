import {
  AddressSystem,
  assertAddress,
  EvmNetworkIdType,
  getAddressSystemFromNetworkId,
  NetworkId,
  NetworkIdType,
} from '@sonarwatch/portfolio-core';
import { getClientAptos, getClientSolana, getEvmClient } from '../clients';
import { hasTransactionsAptos } from './hasTransactionsAptos';
import { hasTransactionsEvm } from './hasTransactionsEvm';
import { hasTransactionsSolana } from './hasTransactionsSolana';

export async function hasTransactions(
  address: string,
  networkId: NetworkIdType
): Promise<boolean> {
  const addressSystem = getAddressSystemFromNetworkId(networkId);
  assertAddress(address, addressSystem);

  if (addressSystem === AddressSystem.evm) {
    const client = getEvmClient(networkId as EvmNetworkIdType);
    return hasTransactionsEvm(address, client);
  }

  switch (networkId) {
    case NetworkId.aptos:
      return hasTransactionsAptos(address, getClientAptos());
    case NetworkId.solana:
      return hasTransactionsSolana(address, getClientSolana());
    default:
      throw new Error(`Network ${networkId} not supported`);
  }
}
