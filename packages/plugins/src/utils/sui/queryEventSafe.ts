import { JsonRpcProvider, SuiEventFilter } from '@mysten/sui.js';

export default async function queryEventsSafe(
  client: JsonRpcProvider,
  query: SuiEventFilter
) {
  const eventsData = [];
  let resp;
  let cursor;
  do {
    resp = await client.queryEvents({
      query,
      cursor,
    });
    cursor = resp.nextCursor;
    if (resp.data.length > 0) eventsData.push(...resp.data);
  } while (resp.hasNextPage);
  return eventsData;
}
