import { EventId, SuiEventFilter } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { Event } from './types';

export async function queryEvents<K>(client: SuiClient, query: SuiEventFilter) {
  let hasNextPage = true;
  let cursor: EventId | null | undefined;

  const objects = [];

  let res;
  do {
    res = await client.queryEvents({
      cursor,
      query,
      limit: 50,
    });
    objects.push(...res.data);
    cursor = res.nextCursor;
    hasNextPage = res.hasNextPage;
  } while (hasNextPage);
  return objects as Event<K>[];
}
