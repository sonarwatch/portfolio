import { AptosClient } from '../clients/types';

export function getAccountCoinsData(client: AptosClient, coinType: string) {
  return client.getAccountCoinsData({
    accountAddress: coinType,
  });
}
