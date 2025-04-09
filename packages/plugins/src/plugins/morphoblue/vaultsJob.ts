import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { getVaults } from './api';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import { tokenListInfoPrefix } from '../tokens/constants';
import { SEVEN_DAYS } from '../../utils/octav/time';
import { buildTokenMetaDataItems, buildTokenPriceSources } from './helpers';
import { morphoVaultsCachePrefix, platformId } from './constants';

export function vaultsJob(networkId: EvmNetworkIdType): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const vaults = await getVaults(networkId);
    if (vaults.length === 0) {
      return;
    }

    const tokens = vaults.map(({ asset }) => asset);

    const uniqueTokens = Object.values(
      tokens.reduce((acc, token) => {
        acc[token.address] = token;
        return acc;
      }, {} as Record<string, (typeof tokens)[number]>)
    );

    const sources = buildTokenPriceSources(uniqueTokens, networkId);
    const tokenMetaDataItems = buildTokenMetaDataItems(uniqueTokens, networkId);

    await Promise.all([
      cache.setItem(morphoVaultsCachePrefix, vaults, {
        prefix: morphoVaultsCachePrefix,
        networkId,
      }),
      cache.setTokenPriceSources(sources),
      cache.setItems(tokenMetaDataItems, {
        prefix: tokenListInfoPrefix,
        networkId,
        ttl: SEVEN_DAYS,
      }),
    ]);
  };
  return {
    id: `${platformId}-${networkId}-vaults`,
    executor,
    labels: ['normal'],
  };
}
