import { DynamicFieldInfo } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';

const maxPage = 25;
export async function getDynamicFieldsSafe(
  client: SuiClient,
  parentId: string,
  objectOnly?: boolean
) {
  let page = 0;
  let hasNextPage = true;
  let cursor: string | null | undefined;

  const objects: DynamicFieldInfo[] = [];
  do {
    const res = await client.getDynamicFields({
      parentId,
      cursor,
    });
    res.data.forEach((o) => {
      if (objectOnly && o.type !== 'DynamicObject') return;
      objects.push(o);
    });
    cursor = res.nextCursor;
    hasNextPage = res.hasNextPage;
    page += 1;
  } while (hasNextPage && page <= maxPage);
  return objects;
}
