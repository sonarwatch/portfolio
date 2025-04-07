import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { Cache } from '../../Cache';
import { Fetcher } from '../../Fetcher';
import {
  aave3PlatformId,
  yieldAssetsPrefix,
  yieldConfigs,
  yieldPoolsPrefix,
} from './constants';
import { getBalances } from '../../utils/evm/getBalances';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { zeroBigInt } from '../../utils/misc/constants';
import { YieldData } from './types';
import { ethFactorBigInt } from '../../utils/evm/constants';

const PLATFORM_ID = aave3PlatformId;

export default function getYieldFetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor = async (owner: string, cache: Cache) => {
    const factories = yieldConfigs
      .get(networkId)
      ?.map((config) => config.factory);

    if (!factories || factories.length === 0) return [];

    const yieldAssetsResponse = await cache.getItems<Address[]>(factories, {
      networkId,
      prefix: yieldAssetsPrefix,
    });

    const yieldAssets = yieldAssetsResponse
      .filter((resp): resp is Address[] => !!resp && resp.length > 0)
      .flat();

    if (!yieldAssets.length) {
      // cache needs to be initialized with yield assets first
      throw new Error(
        `Yield assets not found for network ${networkId}, please check the cache`
      );
    }

    const balances = await getBalances(owner, yieldAssets, networkId);

    const registry = new ElementRegistry(networkId, PLATFORM_ID);

    for (let i = 0; i < balances.length; i++) {
      const yieldAsset = yieldAssets[i];
      const balance = balances[i];

      if (!yieldAsset || !balance || balance === zeroBigInt) continue;

      const yieldData = await cache.getItem<YieldData>(yieldAsset, {
        prefix: yieldPoolsPrefix,
        networkId,
      });

      if (!yieldData) continue;

      const balanceInUnderlying =
        (balance * BigInt(yieldData.conversionRate)) / ethFactorBigInt;

      registry
        .addElementMultiple({
          platformId: PLATFORM_ID,
          label: 'Yield',
          name: yieldData.elementName,
        })
        .addAsset({
          address: yieldData.underlyingAssetAddress,
          amount: balanceInUnderlying.toString(),
        });
    }
    return registry.getElements(cache);
  };

  return {
    id: `${PLATFORM_ID}-${networkId}-yield`,
    networkId,
    executor,
  };
}
