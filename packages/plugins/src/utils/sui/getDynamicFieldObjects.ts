import { SuiObjectDataOptions } from '@mysten/sui.js/client';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';
import { getDynamicFields } from './getDynamicFields';
import { multiGetObjects } from './multiGetObjects';

export async function getDynamicFieldObjects<K>(
  client: SuiClient,
  parentId: string,
  options?: SuiObjectDataOptions
): Promise<ObjectResponse<K>[]> {
  const res = await getDynamicFields(client, parentId);
  const ids = res.map((r) => r.objectId);
  return multiGetObjects<K>(client, ids, options);
}
