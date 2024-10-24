import { SuiObjectDataOptions } from '@mysten/sui/client';
import { SuiClient } from '../clients/types';
import { ObjectResponse } from './types';

export async function getObject<K>(
  client: SuiClient,
  id: string,
  options?: SuiObjectDataOptions
): Promise<ObjectResponse<K>> {
  return (await client.getObject({
    id,
    options: {
      ...options,
      showType: true,
      showContent: true,
    },
  })) as ObjectResponse<K>;
}
