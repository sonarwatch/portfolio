import { AptosClient } from '../clients/types';

export async function getAccountResource<T extends object>(
  client: AptosClient,
  accountAddress: string,
  resourceType: `${string}::${string}::${string}`
) {
  const resource = await client
    .getAccountResource<T>({
      accountAddress,
      resourceType,
    })
    .catch((e) => {
      if (!e.status || e.status !== 404) throw e;
    });
  if (!resource) return null;
  return resource;
}
