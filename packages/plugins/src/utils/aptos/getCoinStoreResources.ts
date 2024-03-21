import { AptosClient } from '../clients/types';
import { getAccountResources } from './getAccountResources';
import { isCoinStoreRessource } from './isCoinStoreRessource';

export async function getCoinStoreResources(
  client: AptosClient,
  owner: string
) {
  const resources = await getAccountResources(client, owner);
  const coinStoreRessources = resources?.filter((resource) =>
    isCoinStoreRessource(resource)
  );
  return coinStoreRessources || null;
}
