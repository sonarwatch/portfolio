import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { getMarkets } from './utils/api';
import { Job, JobExecutor } from '../../Job';
import { morphoMarketsCachePrefix, platformId } from './constants';
import { Cache } from '../../Cache';
import { tokenListInfoPrefix } from '../tokens/constants';
import { buildTokenMetaDataItems, buildTokenPriceSources } from './helpers';

const metaDataTTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export function marketsJob(networkId: EvmNetworkIdType): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const markets = await getMarkets(networkId);
    if (markets.length === 0) {
      return;
    }

    const tokens = markets.flatMap(({ loanAsset, collateralAsset }) => [
      loanAsset,
      collateralAsset,
    ]);
    const uniqueTokens = Object.values(
      tokens.reduce((acc, token) => {
        acc[token.address.toLowerCase()] = token;
        return acc;
      }, {} as Record<string, (typeof tokens)[number]>)
    );

    const sources = buildTokenPriceSources(uniqueTokens, networkId);
    const tokenMetaDataItems = buildTokenMetaDataItems(uniqueTokens, networkId);

    await Promise.all([
      cache.setItem(morphoMarketsCachePrefix, markets, {
        prefix: morphoMarketsCachePrefix,
        networkId,
      }),
      cache.setTokenPriceSources(sources),
      cache.setItems(tokenMetaDataItems, {
        prefix: tokenListInfoPrefix,
        networkId,
        ttl: metaDataTTL,
      }),
    ]);
  };
  return {
    id: `${platformId}-${networkId}-markets`,
    executor,
    labels: ['normal'],
  };
}
