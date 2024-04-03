import { AptosClient } from '../clients/types';

export async function getAccountObjects(
  client: AptosClient,
  accountAddress: string
) {
  const resources = await client
    .getAccountOwnedObjects({
      accountAddress,
    })
    .catch((e) => {
      if (!e.status || e.status !== 404) throw e;
    });
  return resources || null;
}
