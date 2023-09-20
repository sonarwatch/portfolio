import { JsonRpcProvider } from '@mysten/sui.js';

export default async function getDynamicFieldsSafe(
  client: JsonRpcProvider,
  parentId: string
) {
  const dynamicFields = [];
  let resp;
  let cursor;
  do {
    resp = await client.getDynamicFields({
      parentId,
      cursor,
    });
    cursor = resp.nextCursor;
    if (resp.data.length > 0) dynamicFields.push(...resp.data);
  } while (resp.hasNextPage);
  return dynamicFields;
}
