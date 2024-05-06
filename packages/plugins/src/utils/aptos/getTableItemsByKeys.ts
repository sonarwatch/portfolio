import { AptosClient } from '../clients/types';
import { getTableItem } from './getTableItem';

const MAX = 20;

export async function getTableItemsByKeys<T>(
  client: AptosClient,
  handle: string,
  keys: (object | string)[],
  keyType: string,
  valueType: string
) {
  const items = [];
  const keysToFetch = [...keys];
  while (keysToFetch.length !== 0) {
    const currKeysToFetch = keysToFetch.splice(0, MAX);
    const currItems = await iGetTableItemsByKeys<T>(
      client,
      handle,
      currKeysToFetch,
      keyType,
      valueType
    );
    items.push(...currItems);
  }
  return items;
}

async function iGetTableItemsByKeys<T>(
  client: AptosClient,
  handle: string,
  keys: (object | string)[],
  keyType: string,
  valueType: string
) {
  const promises = keys.map((key) =>
    getTableItem<T>(client, handle, {
      key,
      key_type: keyType,
      value_type: valueType,
    })
  );
  const results = await Promise.allSettled(promises);
  return results.map((result) => {
    if (result.status === 'rejected') return null;
    return result.value;
  });
}
