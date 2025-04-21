import { NetworkIdType } from './Network';
import { Yield } from './Yield';

export const tokenYieldTtl = 24 * 60 * 60 * 1000; // 24 hours

export type TokenYield = {
  address: string;
  networkId: NetworkIdType;
  yield: Yield; // prefer week yield
  timestamp: number; // in ms
};
