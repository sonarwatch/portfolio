import { AptosClient } from 'aptos';
import { ViewRequest } from './types';

export async function getView(client: AptosClient, payload: ViewRequest) {
  const resource = await client.view(payload).catch((e) => {
    if (!e.status || e.status !== 404) throw e;
  });
  if (!resource) return null;
  return resource;
}
