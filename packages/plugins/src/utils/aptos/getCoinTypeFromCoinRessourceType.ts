import { isCoinStoreRessourceType } from './isCoinStoreRessourceType';

export function getCoinTypeFromCoinRessourceType(coinRessourceType: string) {
  if (!isCoinStoreRessourceType(coinRessourceType))
    throw new Error(
      `ressourceType ${coinRessourceType} is not a CoinRessourceType`
    );

  return coinRessourceType.slice(20, -1);
}
