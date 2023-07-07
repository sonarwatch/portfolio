import { AptosClient } from 'aptos';
import { TableItemRequest } from './types';

export async function getTableItem<T>(
  client: AptosClient,
  handle: string,
  data: TableItemRequest
) {
  const item: void | T = await client.getTableItem(handle, data).catch((e) => {
    if (!e.status || e.status !== 404) throw e;
  });
  return item || null;
}
