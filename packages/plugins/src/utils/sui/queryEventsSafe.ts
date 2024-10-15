import { EventId, SuiEventFilter } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { Event } from './types';

const maxPage = 50;

export async function queryEventsSafe<K>(
  client: SuiClient,
  query: SuiEventFilter
) {
  let page = 0;
  let hasNextPage = true;
  let cursor: EventId | null | undefined;
  let res;
  const objects = [];

  do {
    res = await client.queryEvents({
      cursor,
      query,
    });
    objects.push(...(res.data as Event<K>[]));
    cursor = res.nextCursor;
    hasNextPage = res.hasNextPage;
    page += 1;
  } while (hasNextPage && page <= maxPage);
  return objects;
}
