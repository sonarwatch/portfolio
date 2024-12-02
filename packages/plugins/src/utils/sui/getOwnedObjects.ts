import { SuiObjectResponseQuery } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';

const maxPage = 25;

export async function getOwnedObjects<K>(
  client: SuiClient,
  owner: string,
  query?: SuiObjectResponseQuery
): Promise<ObjectResponse<K>[]> {
  let page = 0;
  let hasNextPage = true;
  let cursor: string | null | undefined;

  const objects: ObjectResponse<K>[] = [];

  do {
    const res = await client.getOwnedObjects({
      owner,
      options: {
        ...query?.options,
      },
      filter: query?.filter,
      cursor,
    });
    objects.push(...(res.data as ObjectResponse<K>[]));
    cursor = res.nextCursor;
    hasNextPage = res.hasNextPage;
    page += 1;
  } while (hasNextPage && page <= maxPage);

  return objects;
}
