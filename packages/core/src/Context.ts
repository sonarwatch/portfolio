import { Cache } from './Cache';
import { TokenPriceCache } from './TokenPriceCache';

export type Context = {
  cache: Cache;
  tokenPriceCache: TokenPriceCache;
};
