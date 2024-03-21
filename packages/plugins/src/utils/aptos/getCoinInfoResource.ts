import { AptosClient } from '../clients/types';
import { coinInfo } from './constants';
import { getAccountResource } from './getAccountResource';
import { getCoinAddressFromCoinType } from './getCoinAddressFromCoinType';
import { CoinInfoData } from './resources/coinInfo';

export function getCoinInfoResource(client: AptosClient, coinType: string) {
  const address = getCoinAddressFromCoinType(coinType);
  return getAccountResource<CoinInfoData>(
    client,
    address,
    `${coinInfo}<${coinType}>`
  );
}
