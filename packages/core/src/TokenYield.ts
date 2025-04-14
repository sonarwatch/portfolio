import { NetworkIdType } from './Network';
import { Yield } from './Yield';

export const tokenYieldTtl = 24 * 60 * 60 * 1000; // 24 hours

export type TokenYield = {
  address: string;
  networkId: NetworkIdType;
  yield: Yield; // prefer week yield
  timebase: 86400000 | 604800000 | 864000000 | 2592000000; // yield is calculated on, in ms
  timestamp: number; // in ms
};
