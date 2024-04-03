import { AptosClient } from '../clients/types';
import { fungibleStoreType } from './constants';
import { getAccountResource } from './getAccountResource';
import { FungibleStoreResource } from './resources/fungibleStore';

export async function getAccountFungibleRessource(
  client: AptosClient,
  accountsAddress: string
) {
  return getAccountResource<FungibleStoreResource>(
    client,
    accountsAddress,
    fungibleStoreType
  );
}
