import { GetDynamicFieldObjectParams } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';

export async function getDynamicFieldObject<K>(
  client: SuiClient,
  params: GetDynamicFieldObjectParams
): Promise<ObjectResponse<K>> {
  const res = await client.getDynamicFieldObject({
    parentId: params.parentId,
    name: params.name,
  });
  return res as ObjectResponse<K>;
}
