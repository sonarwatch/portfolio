import {
  EvmNetworkIdType,
  formatTokenAddress,
  networks,
} from '@sonarwatch/portfolio-core';
import { getVaults } from './helpers/api';
import { Job, JobExecutor } from '../../Job';
import { morphoVaultsCachePrefix, platformId } from './constants';
import { Cache } from '../../Cache';
import { tokenListInfoPrefix } from '../tokens/constants';

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

    // Token Prices
    const sources = uniqueTokens
      .filter((token) => !!token.priceUsd)
      .map((token) => ({
        address: formatTokenAddress(token.address, networkId),
        decimals: token.decimals,
        id: platformId,
        networkId,
        platformId,
        price: token.priceUsd!,
        timestamp: Date.now(),
        weight: 1,
      }));

    // Token Metadata
    const morphoTokensMetaData = uniqueTokens.map((morphoToken) => ({
      // simulate shape of tokenList response
      chainId: networks[networkId].chainId,
      address: morphoToken.address,
      decimals: morphoToken.decimals,
      name: morphoToken.name,
      symbol: morphoToken.symbol,
      logoURI: morphoToken.logoURI,
      extensions: {},
    }));

    const tokenMetaDataItems = morphoTokensMetaData.map((token) => {
      const address = formatTokenAddress(token.address, networkId);
      return {
        key: address,
        value: {
          ...token,
          address,
        },
      };
    });

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
    id: `${platformId}-markets`,
    executor,
    labels: ['normal'],
  };
}
