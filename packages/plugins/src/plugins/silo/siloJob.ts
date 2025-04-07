import { BigNumber } from 'bignumber.js';

import { EvmNetworkIdType, formatEvmAddress } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { logger } from '@nx/devkit';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { conversionRateAbi, poolAbi } from './abis';
import {
  platformId,
  siloPoolsKey,
  siloVaults,
  missingTokenPriceAddresses,
  legacyPools,
  llamaPools,
  mainetPools,
} from './constants';
import { SiloPool } from './types';

const CONVERSION_RATE_DIVISOR = 1e18;

export default function getSiloJob(networkId: EvmNetworkIdType): Job {
  const legacyid = legacyPools.map((p) => p.id);
  const llamaid = llamaPools.map((p) => p.id);
  const mainnetid = mainetPools.map((p) => p.id);

  // Combine all pool ids into one array and remove duplicates using Set
  const allPools = [...legacyid, ...llamaid, ...mainnetid];

  // Remove duplicates
  const uniquePoolss = [...new Set(allPools)];

  const matchingIds = siloVaults.filter((address) =>
    uniquePoolss.includes(address.toLowerCase())
  );

  // Find missing ids in siloVaults (addresses in siloVaults but not in silos)
  const missingInSilos = siloVaults.filter(
    (address) => !uniquePoolss.includes(address.toLowerCase())
  );

  // Find missing ids in siloVaults (addresses in silos but not in siloVaults)
  const missingInSiloVaults = uniquePoolss.filter(
    (id) => !siloVaults.includes(formatEvmAddress(id) as Address)
  );

  logger.info(`matchingIds: ${matchingIds}`);
  logger.info(`missingInSilos: ${missingInSilos}`);
  logger.info(`missingInSiloVaults: ${missingInSiloVaults}`);

  const client = getEvmClient(networkId);

  const executor: JobExecutor = async (cache: Cache) => {
    // Get assets with states for each vault
    const assetsWithStatesRes = await client.multicall({
      contracts: siloVaults.map(
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
    assetsWithStatesRes.forEach((res, i) => {
      if (res.status !== 'success') return;

      const [, assetsStorages] = res.result;
      const vault = siloVaults[i];

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
      ...missingTokenPriceAddresses.map(
        (address) =>
          ({
            address,
            abi: conversionRateAbi,
            functionName: 'convertToAssets',
            args: [BigInt(CONVERSION_RATE_DIVISOR)] as const,
          } as const)
      ),
      // Get underlying assets for missing tokens
      ...missingTokenPriceAddresses.map(
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
    const missingTokensCount = missingTokenPriceAddresses.length;

    const [poolAssetResults, conversionRateResults, underlyingAssetResults] = [
      results.slice(0, poolsCount),
      results.slice(poolsCount, poolsCount + missingTokensCount),
      results.slice(poolsCount + missingTokensCount),
    ];

    // Update pools with asset addresses
    poolAssetResults.forEach((res, i) => {
      if (res.status === 'success') {
        pools[i].asset = res.result as Address;
      }
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
      const missingTokenIndex = missingTokenPriceAddresses.indexOf(
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
      cache.setItem(siloPoolsKey, uniquePools, {
        prefix: platformId,
        networkId,
      }),
    ]);
  };

  return {
    id: `${platformId}-${networkId}-pools`,
    executor,
    labels: ['normal'],
  };
}
