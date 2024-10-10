import { SuiObjectDataOptions } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import runInBatch from '../misc/runInBatch';
import { getDynamicFieldObjectsSafe } from './getDynamicFieldObjectsSafe';
import { ObjectResponse } from './types';

export async function multipleGetDynamicFieldsObjectsSafe<K>(
  client: SuiClient,
  parentIds: string[],
  options?: SuiObjectDataOptions
): Promise<ObjectResponse<K>[][]> {
  const result = await runInBatch(
    parentIds.map(
      (parentId) => () =>
        getDynamicFieldObjectsSafe<K>(client, parentId, options)
    ),
    10
  );

  return result.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
}
