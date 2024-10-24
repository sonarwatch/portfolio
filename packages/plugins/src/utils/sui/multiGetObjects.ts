import { SuiObjectDataOptions } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';

const maxSize = 50;

export async function multiGetObjects<K>(
  client: SuiClient,
  ids: string[],
  options?: SuiObjectDataOptions
): Promise<ObjectResponse<K>[]> {
  if (ids.length === 0) return [];

  const items: ObjectResponse<K>[] = [];
  const idsToFetch = [...ids];
  while (idsToFetch.length !== 0) {
    const currIdsToFetch = idsToFetch.splice(0, maxSize);
    const currItems = (await client.multiGetObjects({
      ids: currIdsToFetch,
      options: {
        ...options,
        showType: true,
        showContent: true,
      },
    })) as ObjectResponse<K>[];
    items.push(...currItems);
  }
  return items;
}
