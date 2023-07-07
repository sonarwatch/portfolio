import { coinStore } from './constants';
import { MoveResource } from './MoveResource';

const prefix = `${coinStore}<`;

export function isCoinStoreRessource<T>(resource: MoveResource<T>) {
  return resource.type.startsWith(prefix);
}
