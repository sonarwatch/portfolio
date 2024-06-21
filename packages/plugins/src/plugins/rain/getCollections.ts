import { NetworkId } from '@sonarwatch/portfolio-core';
import { Collection } from './types';
import {
  collectionsKey,
  platformId,
  skipCacheRefreshInterval,
} from './constants';
import { Cache } from '../../Cache';

let item: Collection[] | undefined;
let itemLastUpdate = 0;

export const getCollections = async (cache: Cache) => {
  if (!item || itemLastUpdate + skipCacheRefreshInterval < Date.now()) {
    item = await cache.getItem<Collection[]>(collectionsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
    itemLastUpdate = Date.now();
  }
  return item;
};
