import { InputViewFunctionData } from '@aptos-labs/ts-sdk';
import { AptosClient } from '../clients/types';

export async function getView(
  client: AptosClient,
  payload: InputViewFunctionData
) {
  const resource = await client.view({ payload }).catch((e) => {
    if (!e.status || e.status !== 404) throw e;
  });
  if (!resource) return null;
  return resource;
}
