import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { getVaults } from './helpers/api';
import { Job, JobExecutor } from '../../Job';
import { morphoVaultsCachePrefix, platformId } from './constants';
import { Cache } from '../../Cache';
import { tokenListInfoPrefix } from '../tokens/constants';
import {
  buildTokenMetaDataItems,
  buildTokenPriceSources,
} from './helpers/jobs';

const metaDataTTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export function vaultsJob(networkId: EvmNetworkIdType): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const vaults = await getVaults(networkId);
    if (vaults.length === 0) {
      return;
    }

    const tokens = vaults.map((vault) => vault.asset);

    const uniqueTokens = Object.values(
      tokens.reduce((acc, token) => {
        acc[token.address.toLowerCase()] = token;
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
        ttl: metaDataTTL,
      }),
    ]);
  };
  return {
    id: `${platformId}-${networkId}-vaults`,
    executor,
    labels: ['normal'],
  };
}
