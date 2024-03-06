import { ObjectResponse } from './types';

export function getObjectNotExistsResponse<K>(
  resp: ObjectResponse<K>
): string | undefined {
  if (
    resp.error &&
    'object_id' in resp.error &&
    !('version' in resp.error) &&
    !('digest' in resp.error)
  ) {
    return resp.error.object_id;
  }

  return undefined;
}
