import { CoinBalance } from '@mysten/sui.js/dist/cjs/client';
import { SuiClient } from '../clients/types';

export async function getMultipleBalances(
  client: SuiClient,
  owner: string,
  coinsTypes: string[]
): Promise<CoinBalance[]> {
  return Promise.all(
    coinsTypes.map((coinType) => client.getBalance({ owner, coinType }))
  );
}
