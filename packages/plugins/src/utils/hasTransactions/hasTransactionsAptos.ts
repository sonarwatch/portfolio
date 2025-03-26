import { AptosClient } from '../clients/types';

export async function hasTransactionsAptos(
  address: string,
  client: AptosClient
) {
  const ressources = await client
    .getAccountResources({
      accountAddress: address,
    })
    .catch(() => []);
  return ressources.length === 0;
}
