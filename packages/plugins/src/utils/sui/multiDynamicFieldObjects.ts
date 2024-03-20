import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';
import { getDynamicFieldObject } from './getDynamicFieldObject';
import runInBatch from '../misc/runInBatch';

export async function multiDynamicFieldObjects<K>(
  client: SuiClient,
  params: {
    parentId: string;
    type: string;
    values: string[];
  }
): Promise<ObjectResponse<K>[]> {
  const { parentId, values, type } = params;
  if (values.length === 0) return [];

  const result = await runInBatch(
    values.map(
      (value) => () =>
        getDynamicFieldObject<K>(client, {
          name: {
            type,
            value,
          },
          parentId,
        })
    ),
    10
  );
  return result.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
}
