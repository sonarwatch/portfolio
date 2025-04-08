import { BigNumber } from 'bignumber.js';

import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { logger } from 'ethers/lib/ethers';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { conversionRateAbi, poolAbi } from './abis';
import {
  PLATFORM_ID,
  SILOS_POOLS_KEY,
  SILOS_VAULTS_KEY,
  MISSING_TOKEN_PRICE_ADDRESSES,
} from './constants';
import { SiloPool } from './types';
import { mapToSuccess } from '../../utils/octav/mapToSuccess';

const CONVERSION_RATE_DIVISOR = 1e18;

export default function getSiloJob(networkId: EvmNetworkIdType): Job {
  const client = getEvmClient(networkId);

  const executor: JobExecutor = async (cache: Cache) => {
    // Get vaults from cache
    const vaults = await cache.getItem<Address[]>(SILOS_VAULTS_KEY, {
      prefix: PLATFORM_ID,
      networkId,
    });

    if (!vaults || vaults.length === 0) {
      logger.info(
        `No vaults found in cache for ${PLATFORM_ID} on ${networkId}`
      );
      return;
    }

    // Get assets with states for each vault
    const assetsWithStatesRes = await client.multicall({
      contracts: vaults.map(
        (vault) =>
          ({
            address: vault,
            abi: poolAbi,
            functionName: 'getAssetsWithState',
          } as const)
      ),
    });

    // Process responses and create pools array
    const pools: SiloPool[] = [];
    const successfulAssetsWithStatesRes = mapToSuccess(assetsWithStatesRes);

    successfulAssetsWithStatesRes.forEach((result, i) => {
      const [, assetsStorages] = result;
      const vault = vaults[i];

      assetsStorages.forEach((storage) => {
        const { collateralToken, collateralOnlyToken, debtToken } = storage;

        // Add lend pool
        pools.push({
          address: collateralToken,
          vault,
          category: 'lend',
          asset: '',
        });

        // Add lend-only pool
        pools.push({
          address: collateralOnlyToken,
          vault,
          category: 'lend',
          asset: '',
        });

        // Add borrow pool
        pools.push({
          address: debtToken,
          vault,
          category: 'borrow',
          asset: '',
        });
      });
    });

    // Prepare all multicall contracts
    const contracts = [
      // Get assets for all pools
      ...pools.map(
        (pool) =>
          ({
            address: pool.address,
            abi: poolAbi,
            functionName: 'asset',
          } as const)
      ),
      // Get conversion rates for missing tokens
      ...MISSING_TOKEN_PRICE_ADDRESSES.map(
        (address) =>
          ({
            address,
            abi: conversionRateAbi,
            functionName: 'convertToAssets',
            args: [BigInt(CONVERSION_RATE_DIVISOR)] as const,
          } as const)
      ),
      // Get underlying assets for missing tokens
      ...MISSING_TOKEN_PRICE_ADDRESSES.map(
        (address) =>
          ({
            address,
            abi: conversionRateAbi,
            functionName: 'asset',
          } as const)
      ),
    ];

    // Execute all calls in a single multicall
    const results = await client.multicall({ contracts });

    // Split results into their respective groups
    const poolsCount = pools.length;
    const missingTokensCount = MISSING_TOKEN_PRICE_ADDRESSES.length;

    const [poolAssetResults, conversionRateResults, underlyingAssetResults] = [
      results.slice(0, poolsCount),
      results.slice(poolsCount, poolsCount + missingTokensCount),
      results.slice(poolsCount + missingTokensCount),
    ];

    // Update pools with asset addresses
    const successfulPoolAssetResults = mapToSuccess(poolAssetResults);
    successfulPoolAssetResults.forEach((result, i) => {
      pools[i].asset = result as Address;
    });

    // Deduplicate pools based on vault and asset combinations
    const uniquePools = pools.filter(
      (pool, index, self) =>
        self.findIndex(
          (p) => p.vault === pool.vault && p.asset === pool.asset
        ) === index
    );

    // Update pools with conversion rates and underlying assets for missing tokens
    uniquePools.forEach((pool) => {
      const missingTokenIndex = MISSING_TOKEN_PRICE_ADDRESSES.indexOf(
        pool.asset as Address
      );
      if (missingTokenIndex === -1) return;

      const conversionRes = conversionRateResults[missingTokenIndex];
      const underlyingRes = underlyingAssetResults[missingTokenIndex];
      if (conversionRes.status === 'success') {
        const updatedPool = {
          ...pool,
          conversionRate: new BigNumber(conversionRes.result.toString()).div(
            CONVERSION_RATE_DIVISOR
          ),
        };
        Object.assign(pool, updatedPool);
      }
      if (underlyingRes.status === 'success') {
        const updatedPool = {
          ...pool,
          underlyingAsset: underlyingRes.result as Address,
        };
        Object.assign(pool, updatedPool);
      }
    });

    // Cache both pools and router mapping
    await Promise.all([
      cache.setItem(SILOS_POOLS_KEY, uniquePools, {
        prefix: PLATFORM_ID,
        networkId,
      }),
    ]);
  };

  return {
    id: `${PLATFORM_ID}-${networkId}-pools`,
    executor,
    labels: ['normal'],
  };
}
