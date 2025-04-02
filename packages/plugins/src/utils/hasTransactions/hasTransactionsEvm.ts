import { EvmClient } from '../clients/types';

export async function hasTransactionsEvm(address: string, client: EvmClient) {
  const count = await client.getTransactionCount({
    address: address as `0x${string}`,
  });
  return count === 0;
}
