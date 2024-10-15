import { DynamicFieldInfo } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';

export async function getDynamicFields(
  client: SuiClient,
  parentId: string,
  objectOnly?: boolean
) {
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
  } while (hasNextPage);
  return objects;
}
