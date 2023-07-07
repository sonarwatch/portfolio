import { AptosClient } from 'aptos';

export async function getAccountResources(
  client: AptosClient,
  accountAddress: string
) {
  const resources = await client
    .getAccountResources(accountAddress)
    .catch((e) => {
      if (!e.status || e.status !== 404) throw e;
    });
  return resources || null;
}
