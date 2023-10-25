import { Network } from '../Network';
import { networksAsArray } from '../constants';

export function getNetworkByLlamaId(llamaId: string): Network | undefined {
  return networksAsArray.find((n) => n.llamaId === llamaId);
}
