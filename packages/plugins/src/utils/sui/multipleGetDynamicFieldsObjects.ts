import { SuiObjectDataOptions } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import runInBatch from '../misc/runInBatch';
import { ObjectResponse } from './types';
import { getDynamicFieldObjects } from './getDynamicFieldObjects';

export async function multipleGetDynamicFieldsObjects<K>(
  client: SuiClient,
  parentIds: string[],
  options?: SuiObjectDataOptions
): Promise<ObjectResponse<K>[][]> {
  const result = await runInBatch(
    parentIds.map(
      (parentId) => () => getDynamicFieldObjects<K>(client, parentId, options)
    ),
    10
  );

  return result.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
}
