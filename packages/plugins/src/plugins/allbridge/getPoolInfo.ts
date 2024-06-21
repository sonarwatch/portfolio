import { NetworkId } from '@sonarwatch/portfolio-core';
import { Pools } from './types';
import {
  cachePrefix,
  poolInfoRefreshInterval,
  poolsCacheKey,
} from './constants';
import { Cache } from '../../Cache';

let poolInfo: Pools | undefined;
let poolInfoLastUpdate = 0;

export const getPoolInfo = async (cache: Cache) => {
  if (!poolInfo || poolInfoLastUpdate + poolInfoRefreshInterval < Date.now()) {
    poolInfo = await cache.getItem<Pools>(poolsCacheKey, {
      prefix: cachePrefix,
      networkId: NetworkId.solana,
    });
    poolInfoLastUpdate = Date.now();
  }
  return poolInfo;
};
