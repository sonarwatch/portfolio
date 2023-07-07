import { coinStore } from './constants';

const prefix = `${coinStore}<`;

export function isCoinStoreRessourceType(ressourceType: string) {
  return ressourceType.startsWith(prefix);
}
