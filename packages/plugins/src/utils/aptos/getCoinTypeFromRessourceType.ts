import { isCoinStoreRessourceType } from './isCoinStoreRessourceType';

export function getCoinTypeFromRessourceType(ressourceType: string) {
  if (!isCoinStoreRessourceType(ressourceType)) return null;
  return ressourceType.slice(21, -1);
}
