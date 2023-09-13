import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../clients';

export async function isBlankAddressEvm(
  networkId: EvmNetworkIdType,
  address: string
) {
  const client = getEvmClient(networkId);
  const count = await client.getTransactionCount({
    address: address as `0x${string}`,
  });
  return count === 0;
}
