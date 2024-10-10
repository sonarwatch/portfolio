import { SuiObjectRef } from '@mysten/sui/client';
import { ObjectResponse } from './types';

export function getObjectDeletedResponse<K>(
  resp: ObjectResponse<K>
): SuiObjectRef | undefined {
  if (
    resp.error &&
    'object_id' in resp.error &&
    'version' in resp.error &&
    'digest' in resp.error
  ) {
    const { error } = resp;
    return {
      objectId: error.object_id,
      version: error.version,
      digest: error.digest,
    } as SuiObjectRef;
  }

  return undefined;
}
