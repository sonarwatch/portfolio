import { AptosClient } from '../clients/types';
import { coinStore } from './constants';
import { getAccountResource } from './getAccountResource';
import { CoinStoreData } from './resources/coinStore';

export function getCoinStoreResource(
  client: AptosClient,
  owner: string,
  coinType: string
) {
  return getAccountResource<CoinStoreData>(
    client,
    owner,
    `${coinStore}<${coinType}>`
  );
}
