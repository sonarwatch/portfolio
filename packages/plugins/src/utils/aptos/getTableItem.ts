import { TableItemRequest } from '@aptos-labs/ts-sdk';
import { AptosClient } from '../clients/types';

export async function getTableItem<T>(
  client: AptosClient,
  handle: string,
  data: TableItemRequest
) {
  const item = await client.getTableItem<T>({ handle, data }).catch((e) => {
    if (!e.status || e.status !== 404) throw e;
  });
  return item || null;
}
