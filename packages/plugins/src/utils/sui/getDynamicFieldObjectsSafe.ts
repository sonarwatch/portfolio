import { SuiObjectDataOptions } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';
import { getDynamicFieldsSafe } from './getDynamicFieldsSafe';
import { multiGetObjects } from './multiGetObjects';

export async function getDynamicFieldObjectsSafe<K>(
  client: SuiClient,
  parentId: string,
  options?: SuiObjectDataOptions
): Promise<ObjectResponse<K>[]> {
  const res = await getDynamicFieldsSafe(client, parentId);
  const ids = res.map((r) => r.objectId);
  return multiGetObjects<K>(client, ids, options);
}
