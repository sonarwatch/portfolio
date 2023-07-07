import { AptosClient } from 'aptos';
import { getTableItem } from './getTableItem';
import { TableItemRequest } from './types';

const MAX = 20;

export async function getTableItemsByHandles<T>(
  client: AptosClient,
  handles: string[],
  data: TableItemRequest
) {
  const items = [];
  const handlesToFetch = [...handles];
  while (handlesToFetch.length !== 0) {
    const currHandlesToFetch = handlesToFetch.splice(0, MAX);
    const currItems = await iGetTableItemsByHandles<T>(
      client,
      currHandlesToFetch,
      data
    );
    items.push(...currItems);
  }
  return items;
}

async function iGetTableItemsByHandles<T>(
  client: AptosClient,
  handles: string[],
  data: TableItemRequest
) {
  const promises = handles.map((handle) =>
    getTableItem<T>(client, handle, data)
  );
  const results = await Promise.allSettled(promises);
  return results.map((result) => {
    if (result.status === 'rejected') return null;
    return result.value;
  });
}
