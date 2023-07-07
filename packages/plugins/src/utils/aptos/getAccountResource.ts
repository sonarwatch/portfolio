import { AptosClient } from 'aptos';
import { MoveResource } from './MoveResource';

export async function getAccountResource<T>(
  client: AptosClient,
  accountAddress: string,
  resourceType: string
) {
  const resource = await client
    .getAccountResource(accountAddress, resourceType)
    .catch((e) => {
      if (!e.status || e.status !== 404) throw e;
    });
  if (!resource) return null;
  return resource as MoveResource<T>;
}
